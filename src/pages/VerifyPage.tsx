import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ImageUpload } from '@/components/ImageUpload';
import { ManualEntryForm } from '@/components/ManualEntryForm';
import { VerificationResults } from '@/components/VerificationResults';
import { ReportDialog } from '@/components/ReportDialog';
import { performOCR, prewarmOCR } from '@/lib/ocr';
import { verifyProduct } from '@/lib/verification';
import { ExtractedDetails, VerificationResult } from '@/types/product';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Camera, CheckCircle, Zap, FileText, Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VerifyPage = () => {
  const { t } = useTranslation();
  useEffect(() => { prewarmOCR(); }, []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [extractedDetails, setExtractedDetails] = useState<ExtractedDetails | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const handleImageSelect = async (file: File) => {
    setIsProcessing(true);
    setResult(null);
    setRawOcrText(null);
    setOcrProgress(t('verify.progress_preprocessing'));

    try {
      const { details, rawText } = await performOCR(file, (msg) => setOcrProgress(msg));
      setExtractedDetails(details);
      setRawOcrText(rawText);

      setOcrProgress(t('verify.progress_verifying'));
      const verificationResult = await verifyProduct(details);
<<<<<<< HEAD
      // Update product name and manufacturer from DB if found
      let detailsChanged = false;
      if (verificationResult.companyName) {
        if (!details.productName) {
          details.productName = verificationResult.companyName;
          detailsChanged = true;
        }
        if (!details.manufacturer) {
          details.manufacturer = verificationResult.companyName;
          detailsChanged = true;
        }
      }
      if (detailsChanged) {
=======
      // Update product name from DB if found
      if (verificationResult.companyName && !details.productName) {
        details.productName = verificationResult.companyName;
>>>>>>> 12933d4a2c9fe474fbaf63f144669acb7d5ef888
        setExtractedDetails({ ...details });
      }
      setResult(verificationResult);
    } catch (error) {
      console.error('Verification failed:', error);
      setOcrProgress(t('verify.progress_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualEntry = async (details: ExtractedDetails) => {
    setIsProcessing(true);
    setResult(null);
    setRawOcrText(null);
    setOcrProgress(t('verify.progress_verifying'));

    try {
      setExtractedDetails(details);
      const verificationResult = await verifyProduct(details);
<<<<<<< HEAD
      let detailsChanged = false;
      if (verificationResult.companyName) {
        if (!details.productName) {
          details.productName = verificationResult.companyName;
          detailsChanged = true;
        }
        if (!details.manufacturer) {
          details.manufacturer = verificationResult.companyName;
          detailsChanged = true;
        }
      }
      if (detailsChanged) {
=======
      if (verificationResult.companyName && !details.productName) {
        details.productName = verificationResult.companyName;
>>>>>>> 12933d4a2c9fe474fbaf63f144669acb7d5ef888
        setExtractedDetails({ ...details });
      }
      setResult(verificationResult);
    } catch (error) {
      console.error('Verification failed:', error);
      setOcrProgress(t('verify.progress_manual_failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setExtractedDetails(null);
    setRawOcrText(null);
    setOcrProgress('');
  };

  const steps = [
    {
      icon: Camera,
      title: t('verify.step_upload'),
      description: t('verify.step_upload_desc')
    },
    {
      icon: Zap,
      title: t('verify.step_ocr'),
      description: t('verify.step_ocr_desc')
    },
    {
      icon: CheckCircle,
      title: t('verify.step_verification'),
      description: t('verify.step_verification_desc')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <Header />

      <main className="flex-1 py-12 md:py-20 relative z-10 animate-in fade-in duration-700">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm border border-white/20 text-primary mb-6 transition-transform hover:scale-105 duration-300">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">{t('verify.header_verify')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-4">
              {t('verify.title_main')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('verify.description')}
            </p>
          </div>

          {/* Steps */}
          {!result && (
            <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-sm border border-white/20 transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 border border-primary/10 shadow-inner">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground mb-0.5">{step.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Methods - Tabs */}
          {!result && (
            <Tabs defaultValue="scan" className="max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="scan" className="gap-2">
                  <Camera className="w-4 h-4" />
                  {t('verify.tab_scan')}
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <Edit className="w-4 h-4" />
                  {t('verify.tab_manual')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan">
                <Card className="border-none shadow-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl overflow-hidden rounded-3xl transition-all duration-500">
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
                  <CardHeader className="bg-white/40 dark:bg-black/40 pb-6 border-b border-white/10 dark:border-white/5">
                    <CardTitle className="text-2xl font-bold">{t('verify.card_title_scan')}</CardTitle>
                    <CardDescription className="text-sm">
                      {t('verify.card_desc_scan')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 pb-8 px-6 md:px-8">
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      isProcessing={isProcessing}
                    />
                    {isProcessing && ocrProgress && (
                      <p className="text-center text-sm text-primary mt-4 animate-pulse">
                        {ocrProgress}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual">
                <Card className="border-none shadow-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl overflow-hidden rounded-3xl relative p-2">
                  <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 z-10" />
                  <div className="p-4 md:p-6 relative z-0">
                    <ManualEntryForm
                      onSubmit={handleManualEntry}
                      isProcessing={isProcessing}
                    />
                  </div>
                </Card>
                {isProcessing && ocrProgress && (
                  <p className="text-center text-sm text-primary mt-4 animate-pulse">
                    {ocrProgress}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Raw OCR Text (debug/transparency) */}
          {rawOcrText && result && (
            <Card className="max-w-2xl mx-auto mb-8 mt-10 border-none shadow-xl bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 group">
              <div className="h-1 w-full bg-muted-foreground/20 group-hover:bg-primary/50 transition-colors" />
              <CardHeader className="pb-3 bg-black/5 dark:bg-white/5">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileText className="w-5 h-5 text-primary" />
                  {t('verify.ocr_extracted')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground max-h-48 overflow-y-auto">
                  {rawOcrText}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          {result && extractedDetails && (
            <VerificationResults
              result={result}
              details={extractedDetails}
              onReport={() => setShowReportDialog(true)}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <Footer />

      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        productName={extractedDetails?.productName}
        brandName={extractedDetails?.manufacturer}
        fssaiNumber={extractedDetails?.licenseNumber}
      />
    </div>
  );
};

export default VerifyPage;
