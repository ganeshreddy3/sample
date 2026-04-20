import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { useSubmitFakeReport } from '@/hooks/useProducts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  brandName?: string;
  fssaiNumber?: string;
}

export function ReportDialog({ open, onOpenChange, productName, brandName, fssaiNumber }: ReportDialogProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [purchaseLocation, setPurchaseLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitReport = useSubmitFakeReport();


  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        title: t('dialog.reason_req'),
        description: t('dialog.reason_desc'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitReport.mutateAsync({
        product_name: productName || 'Unknown Product',
        brand_name: brandName || 'Unknown Brand',
        fssai_number: fssaiNumber,
        reason: reason,
        evidence: evidence,
        purchase_location: purchaseLocation,
      });
      
      toast({
        title: t('dialog.success'),
        description: t('dialog.success_desc'),
      });
      
      setReason('');
      setEvidence('');
      setPurchaseLocation('');
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('dialog.failed'),
        description: error.message || t('dialog.failed_desc'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-danger" />
            {t('dialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('dialog.desc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {(productName || brandName || fssaiNumber) && (
            <div className="p-4 rounded-xl bg-muted/70 flex flex-col gap-1 text-sm border">
              <Label className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">{t('dialog.l_details')}</Label>
              
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-start">
                {productName && (
                  <>
                    <span className="font-medium text-xs text-muted-foreground mt-0.5">{t('dialog.l_name')}</span>
                    <span className="text-sm font-medium break-words leading-tight">{productName}</span>
                  </>
                )}
                {brandName && (
                  <>
                    <span className="font-medium text-xs text-muted-foreground mt-0.5">{t('dialog.l_brand')}</span>
                    <span className="text-sm font-medium break-words leading-tight">{brandName}</span>
                  </>
                )}
                {fssaiNumber && (
                  <>
                    <span className="font-medium text-xs text-muted-foreground mt-0.5">{t('dialog.l_fssai')}</span>
                    <span className="text-sm font-mono break-words leading-tight bg-background px-1.5 py-0.5 rounded-md border text-xs">{fssaiNumber}</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">{t('dialog.l_reason')}</Label>
            <Textarea
              id="reason"
              placeholder={t('dialog.ph_reason')}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence">{t('dialog.l_evidence')}</Label>
            <Textarea
              id="evidence"
              placeholder={t('dialog.ph_evidence')}
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseLocation">{t('report.l_where') || 'Purchase Location (City, State, Pincode)'}</Label>
            <Input
              id="purchaseLocation"
              placeholder={t('report.ph_where') || 'e.g., Mumbai, Maharashtra 400001'}
              value={purchaseLocation}
              onChange={(e) => setPurchaseLocation(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('dialog.btn_cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-danger hover:bg-danger/90 text-danger-foreground"
          >
            {isSubmitting ? (
              t('dialog.btn_submitting')
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {t('dialog.btn_submit')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
