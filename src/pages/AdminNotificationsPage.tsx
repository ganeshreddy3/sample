import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFssaiLicenses, useUpdateFssaiLicenseStatus, useDeleteFssaiLicense, useUpdateFssaiLicenseDate } from '@/hooks/useProducts';
import { AlertTriangle, Bell, Calendar, ArrowLeft, ArrowRight, XCircle, Check, Trash2, Edit2, Save, X } from 'lucide-react';

const AdminNotificationsPage = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { data: licenses = [], isLoading: licensesLoading, error } = useFssaiLicenses();
  const { toast } = useToast();
  const updateStatus = useUpdateFssaiLicenseStatus();
  const deleteLicense = useDeleteFssaiLicense();
  const updateDate = useUpdateFssaiLicenseDate();
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  const expiringLicenses = useMemo(() => {
    const today = new Date();
    return licenses.reduce((acc, lic) => {
      if (!lic.valid_until || lic.status === 'acknowledged') return acc;
      const expireDate = new Date(lic.valid_until);
      const diffTime = expireDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) {
        acc.push({ ...lic, diffDays });
      }
      return acc;
    }, [] as any[]).sort((a, b) => a.diffDays - b.diffDays);
  }, [licenses]);

  if (authLoading || licensesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The useEffect redirect will handle this
  }

  const expiredCount = expiringLicenses.filter(l => l.diffDays < 0).length;
  const expiringSoonCount = expiringLicenses.filter(l => l.diffDays >= 0 && l.diffDays <= 30).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <Header />
      
      <main className="flex-1 py-8 md:py-16 relative z-10 animate-in fade-in duration-700">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin')} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 to-red-600 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
                  <Bell className="w-8 h-8 text-amber-500" />
                  Notifications
                </h1>
              </div>
              <p className="text-muted-foreground font-medium ml-14">
                Monitor products with FSSAI licenses expiring in the next 30 days.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm flex items-center gap-3 text-destructive">
               <AlertTriangle className="w-5 h-5" />
               <p><strong>Error loading data:</strong> Failed to fetch licenses. Please check your connection.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
             <Card className="border-none shadow-lg bg-gradient-to-br from-red-500/10 to-rose-600/10 backdrop-blur-md overflow-hidden relative group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-red-600/80 uppercase tracking-wider mb-1">Already Expired</p>
                      <h3 className="text-4xl font-black text-red-600/90">{expiredCount}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10">
                      <XCircle className="w-7 h-7 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-md overflow-hidden relative group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="relative z-10">
                      <p className="text-sm font-bold text-amber-600/80 uppercase tracking-wider mb-1">Expiring in &le; 30 Days</p>
                      <h3 className="text-4xl font-black text-amber-600/90">{expiringSoonCount}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10">
                      <AlertTriangle className="w-7 h-7 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

          <div className="space-y-4">
            {expiringLicenses.length === 0 ? (
              <Card className="border-dashed border-2 bg-transparent shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-emerald-500/60" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">All Clear!</h3>
                  <p className="text-muted-foreground w-3/4 mx-auto">There are no products with licenses expiring in the next 30 days. You are fully up to date.</p>
                </CardContent>
              </Card>
            ) : (
              expiringLicenses.map((lic) => {
                const isExpired = lic.diffDays < 0;
                const statusColor = isExpired ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
                const borderColor = isExpired ? 'border-red-500/30' : 'border-amber-500/30';
                
                return (
                  <Card key={lic.id} className={`overflow-hidden transition-all duration-300 hover:shadow-md border ${borderColor}`}>
                     <div className={`h-1 w-full bg-gradient-to-r ${isExpired ? 'from-red-500 to-rose-500' : 'from-amber-400 to-orange-500'}`} />
                     <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                              {lic.company_name}
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>
                                {isExpired ? 'EXPIRED' : `${lic.diffDays} DAYS LEFT`}
                              </span>
                            </h3>
                            <p className="text-sm font-mono text-muted-foreground bg-muted/30 px-2 py-1 rounded inline-block">
                              FSSAI: {lic.license_number}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm mt-4 sm:mt-0">
                            {editingDateId === lic.id ? (
                              <div className="flex items-center gap-1 mr-4">
                                <Input 
                                  type="date" 
                                  value={newDate} 
                                  onChange={(e) => setNewDate(e.target.value)} 
                                  className="h-8 text-sm max-w-[140px] px-2"
                                />
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 ml-1" onClick={async () => {
                                  if (!newDate) return;
                                  try {
                                    await updateDate.mutateAsync({ id: lic.id, valid_until: newDate });
                                    toast({ title: 'Expiry date updated' });
                                    setEditingDateId(null);
                                  } catch (err) {
                                    toast({ title: 'Failed to update', variant: 'destructive' });
                                  }
                                }} disabled={updateDate.isPending}>
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => setEditingDateId(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 mr-4">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium text-foreground whitespace-nowrap">
                                  Valid until: <span className={isExpired ? 'text-red-500 font-bold' : ''}>{new Date(lic.valid_until).toLocaleDateString()}</span>
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-muted-foreground hover:text-primary transition-colors" onClick={() => {
                                  setEditingDateId(lic.id);
                                  const d = new Date(lic.valid_until);
                                  setNewDate(d.toISOString().split('T')[0]);
                                }}>
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            )}
                            <div className="flex items-center gap-2 sm:border-l sm:pl-4">

                              <Button variant="outline" size="sm" className="h-8 gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200" disabled={deleteLicense.isPending} onClick={async () => {
                                if (!window.confirm('Delete this license permanently?')) return;
                                try {
                                  await deleteLicense.mutateAsync(lic.id);
                                  toast({ title: 'License deleted' });
                                } catch (err) {
                                  toast({ title: 'Delete Failed', variant: 'destructive' });
                                }
                              }}>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                     </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminNotificationsPage;
