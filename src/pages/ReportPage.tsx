import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSubmitFakeReport } from '@/hooks/useProducts';
import { AlertTriangle, Send, Shield, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ReportPage = () => {
  const { t } = useTranslation();
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState('');
  const [purchaseLocation, setPurchaseLocation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const submitReport = useSubmitFakeReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !brandName.trim() || !reason.trim()) {
      toast({
        title: t('report.missing_info'),
        description: t('report.fill_fields'),
        variant: "destructive"
      });
      return;
    }

    submitReport.mutate(
      {
        product_name: productName.trim(),
        brand_name: brandName.trim(),
        reason: reason.trim(),
        fssai_number: fssaiNumber.trim() || undefined,
        evidence: evidence.trim() || undefined,
        purchase_location: purchaseLocation.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: t('report.success_title'),
            description: t('report.success_desc'),
          });
          setIsSubmitted(true);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
          toast({
            title: t('report.fail_title'),
            description: message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReset = () => {
    setProductName('');
    setBrandName('');
    setFssaiNumber('');
    setReason('');
    setEvidence('');
    setPurchaseLocation('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="pt-12 pb-8">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-3">
                  {t('report.success_title')}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t('report.thank_you')}
                </p>
                <Button onClick={handleReset}>{t('report.submit_another')}</Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-red-500/30 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <Header />

      <main className="flex-1 py-12 md:py-20 relative z-10 animate-in fade-in duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm border border-red-500/20 text-red-500 mb-6 transition-transform hover:scale-105 duration-300">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">{t('report.badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent drop-shadow-sm mb-4">
              {t('report.title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('report.desc')}
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-red-500/10 shadow-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl overflow-hidden rounded-3xl relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 via-red-500 to-rose-500" />
            <CardHeader className="bg-white/40 dark:bg-black/40 pb-6 border-b border-white/10 dark:border-white/5 pt-8">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Shield className="w-6 h-6 text-red-500" />
                {t('report.details_title')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('report.details_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-6 md:px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="productName" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_product')}</Label>
                    <Input
                      id="productName"
                      placeholder={t('report.ph_product')}
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandName" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_brand')}</Label>
                    <Input
                      id="brandName"
                      placeholder={t('report.ph_brand')}
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fssaiNumber" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_fssai')}</Label>
                    <Input
                      id="fssaiNumber"
                      placeholder={t('report.ph_fssai')}
                      value={fssaiNumber}
                      onChange={(e) => setFssaiNumber(e.target.value)}
                      className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseLocation" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_where')}</Label>
                    <Input
                      id="purchaseLocation"
                      placeholder={t('report.ph_where')}
                      value={purchaseLocation}
                      onChange={(e) => setPurchaseLocation(e.target.value)}
                      className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_reason')}</Label>
                  <Textarea
                    id="reason"
                    placeholder={t('report.ph_reason')}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence" className="font-semibold text-slate-700 dark:text-slate-300">{t('report.l_evidence')}</Label>
                  <Textarea
                    id="evidence"
                    placeholder={t('report.ph_evidence')}
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    rows={3}
                    className="bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-red-500/50 shadow-inner rounded-xl resize-none"
                  />
                </div>

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-1 h-14 text-lg" disabled={submitReport.isPending}>
                    {submitReport.isPending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        {t('report.btn_submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        {t('report.btn_submit')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;
