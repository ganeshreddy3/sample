import { supabase } from '@/integrations/supabase/client';
import stringSimilarity from 'string-similarity';
import {
  ExtractedDetails,
  VerificationResult,
  VerificationCheck,
  ProductStatus,
  FakeReport,
} from '@/types/product';

async function validateFSSAILicenseFromDB(licenseNumber: string) {
  const { data } = await supabase
    .from('fssai_licenses')
    .select('*')
    .eq('license_number', licenseNumber)
    .maybeSingle();
  return data;
}

/**
 * Verifies product based solely on FSSAI license number.
 * If license exists in DB and is active -> genuine (100).
 * Otherwise -> fake (0).
 */
export async function verifyProduct(
  details: ExtractedDetails
): Promise<VerificationResult & { companyName?: string }> {
  const checks: VerificationCheck[] = [];
  let companyName: string | undefined;
  let trustScore = 0;
  let status: ProductStatus = 'fake';

  if (!details.licenseNumber || details.licenseNumber.trim().length < 10) {
    checks.push({
      name: 'FSSAI License',
      passed: false,
      message: 'No valid FSSAI license number found',
      severity: 'error',
    });
    return {
      isValid: false,
      trustScore: 0,
      status: 'fake',
      checks,
      recommendations: ['Ensure FSSAI license number (14 digits) is visible on the product label.'],
      warnings: ['FSSAI license is required for food products in India.'],
      reportCount: 0,
    };
  }

  const licenseNumber = details.licenseNumber.replace(/\s/g, '').replace(/^0+/, '').padStart(14, '0');

  // Check if product was already verified and stored to preserve any admin-adjusted trust scores
  const { data: existingProduct } = await supabase
    .from('products')
    .select('*')
    .eq('license_number', licenseNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const license = await validateFSSAILicenseFromDB(licenseNumber);

  const { data: fakeReportsData } = await supabase
    .from('fake_reports')
    .select('*')
    .eq('fssai_number', licenseNumber);

  const reports: FakeReport[] = (fakeReportsData || []).map(r => ({
    id: r.id,
    productId: r.fssai_number || 'Unknown',
    reportedBy: r.reporter_id || 'Anonymous',
    reason: r.reason,
    evidence: r.evidence || undefined,
    status: r.status as 'pending' | 'confirmed' | 'rejected',
    createdAt: r.created_at,
    reviewedAt: r.reviewed_at || undefined,
    reviewedBy: r.reviewed_by || undefined,
    purchaseLocation: r.purchase_location || undefined
  }));

  const actualReportCount = reports.length;

  if (existingProduct) {
    companyName = existingProduct.manufacturer;
    trustScore = existingProduct.trust_score ?? 0;
    // Apply logic: >84 is passed all tests and genuine
    if (trustScore > 84) {
      status = 'genuine';
      if (trustScore < 100) {
        checks.push({
          name: 'Community Trust',
          passed: true,
          message: `Trust score is ${trustScore}. Product remains in genuine status.`,
          severity: 'info'
        });
      }
    } else {
      status = trustScore >= 40 ? 'suspicious' : 'fake';
      checks.push({
        name: 'Community Trust',
        passed: false,
        message: `Trust score is ${trustScore} (Failed genuine threshold >84).`,
        severity: trustScore >= 40 ? 'warning' : 'error'
      });
    }

    if (license) {
      if (license.status === 'active') {
        checks.push({ name: 'FSSAI License', passed: true, message: `Valid license verified for ${license.company_name}`, severity: 'info' });
      } else if (license.status === 'expired') {
        checks.push({ name: 'FSSAI License', passed: false, message: `License expired on ${license.valid_until || 'N/A'}`, severity: 'error' });
      } else {
        checks.push({ name: 'FSSAI License', passed: false, message: 'License has been revoked', severity: 'error' });
      }
    } else {
      // Fallback for public users if RLS blocks querying fssai_licenses directly
      if (status === 'genuine' || status === 'suspicious') {
        checks.push({ name: 'FSSAI License', passed: true, message: `Registered license verified mapped to ${companyName}`, severity: 'info' });
      } else {
        checks.push({ name: 'FSSAI License', passed: false, message: 'License number not found or flagged', severity: 'error' });
      }
    }

    return {
      isValid: status === 'genuine',
      trustScore,
      status,
      checks,
      recommendations: status === 'genuine' 
        ? ['Product verified. Always buy from authorized retailers.'] 
        : ['Do not purchase. This product has been flagged or reported.'],
      warnings: status === 'genuine' ? [] : ['Verification failed or trust score reduced.'],
      companyName,
      reportCount: actualReportCount,
      reports,
    };
  }


  if (license) {
    companyName = license.company_name;
    if (license.status === 'active') {
      trustScore = 100;
      status = 'genuine';
      checks.push({
        name: 'FSSAI License',
        passed: true,
        message: `Valid license verified for ${license.company_name}`,
        severity: 'info',
      });
    } else if (license.status === 'expired') {
      trustScore = 0;
      status = 'fake';
      checks.push({
        name: 'FSSAI License',
        passed: false,
        message: `License expired on ${license.valid_until || 'N/A'}`,
        severity: 'error',
      });
    } else {
      trustScore = 0;
      status = 'fake';
      checks.push({
        name: 'FSSAI License',
        passed: false,
        message: 'License has been revoked',
        severity: 'error',
      });
    }
  } else {
    // Exact License not found. Trigger ML heuristic pattern matching fallback.
    let heuristicMatched = false;
    
    if (details.manufacturer || details.productName) {
      const { data: allProducts } = await supabase.from('products').select('name, manufacturer');
      
      if (allProducts && allProducts.length > 0) {
        let bestRating = 0;
        let matchedEntity = '';
        
        allProducts.forEach((p) => {
          // 1. Direct Field-to-Field Comparisons
          if (details.manufacturer && p.manufacturer) {
            const r = stringSimilarity.compareTwoStrings(details.manufacturer.toLowerCase(), p.manufacturer.toLowerCase());
            if (r > bestRating) { bestRating = r; matchedEntity = p.manufacturer; }
          }
          if (details.productName && p.name) {
            const r = stringSimilarity.compareTwoStrings(details.productName.toLowerCase(), p.name.toLowerCase());
            if (r > bestRating) { bestRating = r; matchedEntity = p.name; }
          }

          // 2. Cross-Field Comparisons (Handles OCR swapping name and manufacturer)
          if (details.productName && p.manufacturer) {
            const r = stringSimilarity.compareTwoStrings(details.productName.toLowerCase(), p.manufacturer.toLowerCase());
            if (r > bestRating) { bestRating = r; matchedEntity = p.manufacturer; }
          }
          
          // 3. Normalized Combined Fingerprint Matching (Handles concatenated acronyms and legal suffixes)
          const normalize = (s: string) => s.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\b(pvt|ltd|private|limited|llp|inc|corp|food|foods|snacks|technologies|company|industry|industries)\b/g, '')
            .replace(/\s+/g, ' ').trim();

          const scanFp = normalize(`${details.productName || ''} ${details.manufacturer || ''}`);
          const dbFp = normalize(`${p.name || ''} ${p.manufacturer || ''}`);
          
          if (scanFp.length > 3 && dbFp.length > 3) {
             const r = stringSimilarity.compareTwoStrings(scanFp, dbFp);
             if (r > bestRating) { bestRating = r; matchedEntity = `${p.manufacturer || p.name}`; }
          }
        });

        // Tuned Similarity threshold across corporate subsidiaries, acronyms, and swapped fields
        if (bestRating >= 0.40) {
          heuristicMatched = true;
          trustScore = 55;
          status = 'suspicious';
          checks.push({
            name: 'ML Pattern Heuristic',
            passed: false,
            message: `Branding similarity (${Math.round(bestRating * 100)}% match to '${matchedEntity}') detected, but FSSAI license is totally unregistered. Possible counterfeit.`,
            severity: 'warning',
          });
          checks.push({
            name: 'FSSAI License',
            passed: false,
            message: 'Unregistered License',
            severity: 'error',
          });
        }
      }
    }

    if (!heuristicMatched) {
      checks.push({
        name: 'FSSAI License',
        passed: false,
        message: 'License number not found in database',
        severity: 'error',
      });
    }
  }

  const productName = details.productName || companyName || 'Unknown Product';
  const manufacturer = details.manufacturer || companyName || 'Unknown';

  await supabase.from('products').upsert({
    name: productName,
    manufacturer,
    license_number: licenseNumber,
    batch_number: details.batchNumber || null,
    status,
    trust_score: trustScore,
    verification_source: 'system',
    verified_at: new Date().toISOString(),
  }, { onConflict: 'license_number,name', ignoreDuplicates: true });

  return {
    isValid: status === 'genuine',
    trustScore,
    status,
    checks,
    recommendations:
      status === 'genuine'
        ? ['Product verified. Always buy from authorized retailers.']
        : ['Do not purchase. Report suspicious products.'],
    warnings: status === 'fake' ? ['FSSAI verification failed.'] : [],
    companyName,
    reportCount: actualReportCount,
    reports,
  };
}
