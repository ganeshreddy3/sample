import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { generateCertificate } from '@/lib/pdfGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatSupabaseError, isUniqueViolation } from '@/lib/supabase-error';
import { useQueryClient } from '@tanstack/react-query';
import { useProducts, useUpdateProduct, useDeleteProduct, useFakeReports, useUpdateFakeReport, useDeleteFakeReport, useFssaiLicenses } from '@/hooks/useProducts';
import { EditProductDialog } from '@/components/EditProductDialog';
import { Product } from '@/types/product';

import { Package, Plus, ShieldCheck, LogOut, Lock, Pencil, AlertTriangle, CheckCircle, XCircle, Trash2, Bell, Settings, KeyRound, Users, UserPlus, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminPage = () => {
  const { isAdmin, isMainAdmin, loading, login, logout, user, addAdmin, changePassword, getAdmins, removeAdmin } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: licenses = [] } = useFssaiLicenses();
  const expiringCount = useMemo(() => {
    let count = 0;
    const today = new Date();
    licenses.forEach((lic) => {
      if (lic.valid_until && lic.status !== 'acknowledged') {
        const diff = Math.ceil((new Date(lic.valid_until).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 30) count++;
      }
    });
    return count;
  }, [licenses]);
  
  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsQueryFailed,
    error: productsQueryError,
    refetch: refetchProducts,
  } = useProducts();
  const {
    data: fakeReports = [],
    isLoading: reportsLoading,
    isError: reportsQueryFailed,
    error: reportsQueryError,
    refetch: refetchReports,
  } = useFakeReports();


  const topLocation = useMemo(() => {
    if (!fakeReports.length) return 'None';
    const locCounts = fakeReports.reduce((acc, r) => {
       if (r.purchase_location && r.purchase_location.trim().length > 2) {
         acc[r.purchase_location] = (acc[r.purchase_location] || 0) + 1;
       }
       return acc;
    }, {} as Record<string, number>);
    
    if (Object.keys(locCounts).length === 0) return 'None yet';
    return Object.entries(locCounts).sort((a,b) => b[1] - a[1])[0][0];
  }, [fakeReports]);

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateFakeReport = useUpdateFakeReport();
  const deleteFakeReport = useDeleteFakeReport();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  
  // Settings forms
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminLoading, setNewAdminLoading] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [form, setForm] = useState({
    productName: '',
    manufacturer: '',
    licenseNumber: '',
    batchNumber: '',
    address: '',
    validUntil: '',
    trustScore: '100',
  });

  const [adminsList, setAdminsList] = useState<{ id: string; email: string }[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(false);

  // Fetch admins list if main admin
  const fetchAdmins = async () => {
    if (!isMainAdmin) return;
    setAdminsLoading(true);
    try {
      const { data, error } = await getAdmins();
      if (error) {
        // Silently fail if the RPC isn't set up yet or fails
        console.error("Failed to fetch admins:", error);
      } else {
        setAdminsList(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdminsLoading(false);
    }
  };

  // Only fetch when the component mounts and the user is verified as main admin
  useMemo(() => {
    if (isMainAdmin) {
      fetchAdmins();
    }
  }, [isMainAdmin]);

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove admin ${email}?`)) return;
    try {
      const { error } = await removeAdmin(id);
      if (error) throw error;
      toast({ title: 'Admin removed', description: `${email} has been deleted.` });
      fetchAdmins();
    } catch (err: unknown) {
      toast({ title: 'Failed to remove admin', description: formatSupabaseError(err), variant: 'destructive' });
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await login(loginForm.email.trim(), loginForm.password);
    setLoginLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back', description: 'You are logged in as admin.' });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged out' });
  };

  const handleEditSave = async (id: string, updates: {
    name?: string;
    manufacturer?: string;
    license_number?: string;
    batch_number?: string | null;
    trust_score?: number;
    status?: string;
  }) => {
    try {
      await updateProduct.mutateAsync({ id, ...updates });
      toast({ title: 'Product updated' });
      setEditDialogOpen(false);
      setEditProduct(null);
    } catch (err: unknown) {
      toast({
        title: 'Could not update product',
        description: formatSupabaseError(err),
        variant: 'destructive',
      });
      throw err;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName.trim() || !form.manufacturer.trim() || !form.licenseNumber.trim()) {
      toast({ title: 'Missing fields', description: 'Product name, manufacturer, and FSSAI license number are required.', variant: 'destructive' });
      return;
    }

    const trustScore = Math.min(100, Math.max(0, parseInt(form.trustScore, 10) || 100));
    const autoStatus = trustScore > 84 ? 'genuine' : trustScore >= 40 ? 'suspicious' : 'fake';

    setAddLoading(true);
    try {
      const { error: licError } = await supabase.from('fssai_licenses').insert({
        license_number: form.licenseNumber.trim(),
        company_name: form.manufacturer.trim(),
        address: form.address.trim() || null,
        valid_until: form.validUntil.trim() || null,
        status: 'active',
      });

      if (licError && !isUniqueViolation(licError)) {
        throw licError;
      }

      const { error: prodError } = await supabase.from('products').insert({
        name: form.productName.trim(),
        manufacturer: form.manufacturer.trim(),
        license_number: form.licenseNumber.trim(),
        batch_number: form.batchNumber.trim() || null,
        status: autoStatus,
        trust_score: trustScore,
        verification_source: 'admin',
        verified_at: new Date().toISOString(),
        is_admin_verified: true,
      });

      if (prodError) throw prodError;

      generateCertificate({
        productName: form.productName.trim(),
        manufacturer: form.manufacturer.trim(),
        licenseNumber: form.licenseNumber.trim(),
        trustScore: trustScore,
        status: autoStatus,
        verifiedAt: new Date().toISOString()
      });

      toast({ title: 'Product added', description: `${form.productName} has been registered with trust score ${trustScore}. Certificate downloaded.` });
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['fssai_licenses'] });
      setForm({ ...form, productName: '', manufacturer: '', licenseNumber: '', batchNumber: '', address: '', validUntil: '', trustScore: '100' });
    } catch (err: unknown) {
      toast({
        title: 'Could not add product',
        description: formatSupabaseError(err),
        variant: 'destructive',
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword) return;
    setNewAdminLoading(true);
    try {
      const { error } = await addAdmin(newAdminEmail, newAdminPassword);
      if (error) throw error;
      toast({ title: 'Admin added successfully', description: `${newAdminEmail} can now log in.` });
      setNewAdminEmail('');
      setNewAdminPassword('');
      fetchAdmins(); // Refresh the list
    } catch (err: unknown) {
      toast({ title: 'Failed to add admin', description: formatSupabaseError(err), variant: 'destructive' });
    } finally {
      setNewAdminLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setChangePasswordLoading(true);
    try {
      const { error } = await changePassword(newPassword);
      if (error) throw error;
      toast({ title: 'Password updated', description: 'Your password has been changed successfully. Please log in again.' });
      setNewPassword('');
      await logout();
    } catch (err: unknown) {
      toast({ title: 'Failed to update password', description: formatSupabaseError(err), variant: 'destructive' });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-sm">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary">
                  <Lock className="w-5 h-5" />
                  <CardTitle>Admin Login</CardTitle>
                </div>
                <CardDescription>Sign in to add products and manage trust scores.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Please enter your administrator credentials to continue.
                </p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                      disabled={loginLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                      disabled={loginLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <Header />
      <main className="flex-1 py-8 md:py-16 relative z-10 animate-in fade-in duration-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 shadow-sm">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">Manage products, verify consumer reports, and maintain trust scores.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/admin/notifications')} className="border-amber-500/30 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 backdrop-blur-md relative">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {expiringCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-black">
                    {expiringCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors backdrop-blur-md">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Top Metrics Row */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <Card className="border-none shadow-lg bg-gradient-to-br from-primary/10 to-blue-500/10 backdrop-blur-md overflow-hidden relative group transform transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-1">Total Products</p>
                    <h3 className="text-4xl font-black text-foreground/90">{products.length}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10">
                    <Package className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500/10 to-red-500/10 backdrop-blur-md overflow-hidden relative group transform transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-amber-600/80 uppercase tracking-wider mb-1">Pending Reports</p>
                    <h3 className="text-4xl font-black text-amber-600/90">{fakeReports.filter((r) => r.status === 'pending').length}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-md overflow-hidden relative group transform transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="relative z-10">
                    <p className="text-sm font-semibold text-emerald-600/80 uppercase tracking-wider mb-1">Verified Genuine</p>
                    <h3 className="text-4xl font-black text-emerald-600/90">{products.filter((p) => p.status === 'genuine').length}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10">
                    <ShieldCheck className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-md overflow-hidden relative group transform transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="relative z-10 truncate pr-2">
                    <p className="text-sm font-semibold text-purple-600/80 uppercase tracking-wider mb-1">Top Risk Region</p>
                    <h3 className="text-2xl font-black text-purple-600/90 truncate" title={topLocation}>{topLocation}</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-black/50 shadow-sm border border-white/20 flex items-center justify-center relative z-10 shrink-0">
                    <MapPin className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {(productsQueryFailed || reportsQueryFailed) && (
            <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm space-y-2">
              {productsQueryFailed && (
                <p>
                  <strong>Products could not load:</strong>{' '}
                  {formatSupabaseError(productsQueryError)}{' '}
                  <Button type="button" variant="link" className="h-auto p-0 align-baseline" onClick={() => void refetchProducts()}>
                    Retry
                  </Button>
                </p>
              )}
              {reportsQueryFailed && (
                <p>
                  <strong>Reports could not load:</strong>{' '}
                  {formatSupabaseError(reportsQueryError)}{' '}
                  <Button type="button" variant="link" className="h-auto p-0 align-baseline" onClick={() => void refetchReports()}>
                    Retry
                  </Button>
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
            {/* Add Product Section */}
            <div className="lg:col-span-5 w-full">
              <Card className="border-primary/10 shadow-xl shadow-primary/5 bg-background/80 backdrop-blur-xl overflow-hidden transform transition-all hover:shadow-2xl hover:border-primary/20 duration-500 mt-0">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-500 to-purple-500" />
                <CardHeader className="bg-muted/10 pb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full translate-x-8 -translate-y-8" />
                  <CardTitle className="flex items-center gap-2 relative z-10">
                <Package className="w-5 h-5 text-primary" />
                Add Product
              </CardTitle>
              <CardDescription>Only admins can add products. Set trust score (0–100) for users.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Amul Butter"
                    value={form.productName}
                    onChange={(e) => update('productName', e.target.value)}
                    disabled={addLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer / Company *</Label>
                  <Input
                    id="manufacturer"
                    placeholder="e.g., Gujarat Cooperative Milk Marketing Federation"
                    value={form.manufacturer}
                    onChange={(e) => update('manufacturer', e.target.value)}
                    disabled={addLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    FSSAI License Number *
                  </Label>
                  <Input
                    id="licenseNumber"
                    placeholder="e.g., 10020021000123"
                    value={form.licenseNumber}
                    onChange={(e) => update('licenseNumber', e.target.value)}
                    disabled={addLoading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trustScore">Trust Score (0–100)</Label>
                  <Input
                    id="trustScore"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="100"
                    value={form.trustScore}
                    onChange={(e) => update('trustScore', e.target.value)}
                    disabled={addLoading}
                  />
                  <p className="text-xs text-muted-foreground">Helps users assess product authenticity. Default: 100.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input
                      id="batchNumber"
                      placeholder="e.g., BT20240101"
                      value={form.batchNumber}
                      onChange={(e) => update('batchNumber', e.target.value)}
                      disabled={addLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validUntil">License Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={form.validUntil}
                      onChange={(e) => update('validUntil', e.target.value)}
                      disabled={addLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Manufacturer Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., Anand, Gujarat, India"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    disabled={addLoading}
                  />
                </div>
                <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5 mt-2" size="lg" disabled={addLoading}>
                  {addLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
            </div>

            {/* Fake Product Reports Section */}
            <div className="lg:col-span-7 w-full h-full flex">
              <Card className="w-full mt-0 border-destructive/10 shadow-xl shadow-destructive/5 bg-background/80 backdrop-blur-xl overflow-hidden transition-all duration-500 flex flex-col">
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-red-500" />
            <CardHeader className="bg-muted/10">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Fake product reports
              </CardTitle>
              <CardDescription>
                Confirm a report to validate the consumer claim: matching products (matching FSSAI number, or matching name and manufacturer) lose 10 trust points automatically. Reject invalid reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <p className="text-muted-foreground text-sm py-6">Loading reports...</p>
              ) : fakeReports.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6">No reports submitted yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-muted/50 shadow-sm bg-background/50">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>Brand / Mfr</TableHead>
                        <TableHead>Reason</TableHead>

                        <TableHead>Location</TableHead>

                        <TableHead>Status</TableHead>
                        <TableHead className="text-right w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fakeReports.map((r) => (
                        <TableRow key={r.id} className="transition-colors hover:bg-muted/40">
                          <TableCell className="font-medium">{r.product_name}</TableCell>
                          <TableCell>
                            <div>{r.brand_name}</div>
                            {r.fssai_number && (
                              <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                                FSSAI: {r.fssai_number}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate" title={r.reason}>
                            {r.reason}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate text-muted-foreground" title={r.purchase_location || ''}>
                            {r.purchase_location || '-'}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${
                                r.status === 'pending'
                                  ? 'bg-slate-100 text-slate-800'
                                  : r.status === 'confirmed'
                                    ? 'bg-red-100 text-red-800'
                                    : r.status === 'rejected'
                                      ? 'bg-gray-100 text-gray-700'
                                      : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {r.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-2 whitespace-nowrap">
                            {r.status === 'pending' && user?.id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="gap-1"
                                  disabled={updateFakeReport.isPending}
                                  onClick={async () => {
                                    try {
                                      await updateFakeReport.mutateAsync({
                                        id: r.id,
                                        status: 'confirmed',
                                        reviewed_by: user.id,
                                        reviewed_at: new Date().toISOString(),
                                      });
                                      toast({
                                        title: 'Report confirmed',
                                        description:
                                          'Trust score was reduced by 10 on matching products (by FSSAI or name).',
                                      });
                                    } catch (err: unknown) {
                                      const msg = err instanceof Error ? err.message : 'Update failed';
                                      toast({ title: 'Could not confirm report', description: msg, variant: 'destructive' });
                                    }
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  disabled={updateFakeReport.isPending}
                                  onClick={async () => {
                                    try {
                                      await updateFakeReport.mutateAsync({
                                        id: r.id,
                                        status: 'rejected',
                                        reviewed_by: user.id,
                                        reviewed_at: new Date().toISOString(),
                                      });
                                      toast({ title: 'Report rejected' });
                                    } catch (err: unknown) {
                                      const msg = err instanceof Error ? err.message : 'Update failed';
                                      toast({ title: 'Could not reject report', description: msg, variant: 'destructive' });
                                    }
                                  }}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteFakeReport.isPending}
                                onClick={async () => {
                                  if (!window.confirm("Are you sure you want to remove this report? Note: Removing it will not automatically restore the product's trust score.")) return;
                                  try {
                                    await deleteFakeReport.mutateAsync(r.id);
                                    toast({ title: 'Report removed successfully' });
                                  } catch (err: unknown) {
                                    const msg = err instanceof Error ? err.message : 'Delete failed';
                                    toast({ title: 'Could not remove report', description: msg, variant: 'destructive' });
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
            </div>
          </div>

          <Card className="border-primary/10 shadow-xl shadow-primary/5 bg-background/80 backdrop-blur-xl overflow-hidden transition-all duration-500">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-primary" />
            <CardHeader className="bg-muted/10">
              <CardTitle className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary" />
                Edit Products
              </CardTitle>
              <CardDescription>View and edit existing products. Change trust score and status.</CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p className="text-muted-foreground text-sm py-6">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6">No products yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-muted/50 shadow-sm bg-background/50">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Product</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>FSSAI</TableHead>
                        <TableHead>Trust</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p.id} className="transition-colors hover:bg-muted/40">
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.manufacturer}</TableCell>
                          <TableCell className="font-mono text-xs">{p.licenseNumber || '-'}</TableCell>
                          <TableCell>{p.trustScore ?? '-'}</TableCell>
                          <TableCell>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              p.status === 'genuine' ? 'bg-green-100 text-green-800' :
                              p.status === 'suspicious' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {p.status}
                            </span>
                          </TableCell>
                          <TableCell className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditProduct(p);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={deleteProduct.isPending}
                              onClick={async () => {
                                if (!window.confirm(`Are you sure you want to permanently delete "${p.name}"?`)) return;
                                try {
                                  await deleteProduct.mutateAsync(p.id);
                                  toast({ title: 'Product deleted' });
                                } catch (err: unknown) {
                                  const msg = err instanceof Error ? err.message : 'Delete failed';
                                  toast({ title: 'Could not delete product', description: msg, variant: 'destructive' });
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-xl shadow-primary/5 bg-background/80 backdrop-blur-xl overflow-hidden transition-all duration-500 mt-10">
            <div className="h-1 w-full bg-gradient-to-r from-slate-400 to-slate-600" />
            <CardHeader className="bg-muted/10">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-600" />
                Settings & Security
              </CardTitle>
              <CardDescription>Manage your account security and admin privileges.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                      <KeyRound className="w-4 h-4" /> Change Password
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Update the password for your current account.</p>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={changePasswordLoading}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" disabled={changePasswordLoading} className="w-full sm:w-auto">
                      {changePasswordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                </div>

                {isMainAdmin && (
                  <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0 border-muted">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                        <UserPlus className="w-4 h-4 text-primary" /> Add New Admin
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">Create a new administrator account.</p>
                    </div>
                    <form onSubmit={handleAddAdmin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newAdminEmail">Email</Label>
                        <Input
                          id="newAdminEmail"
                          type="email"
                          placeholder="admin@example.com"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          disabled={newAdminLoading}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newAdminPassword">Password</Label>
                        <Input
                          id="newAdminPassword"
                          type="password"
                          placeholder="••••••••"
                          value={newAdminPassword}
                          onChange={(e) => setNewAdminPassword(e.target.value)}
                          disabled={newAdminLoading}
                          required
                          minLength={6}
                        />
                      </div>
                      <Button type="submit" variant="secondary" disabled={newAdminLoading} className="w-full sm:w-auto">
                        {newAdminLoading ? 'Adding...' : 'Add Admin'}
                      </Button>
                    </form>

                    {adminsList.length > 0 && (
                      <div className="pt-6 mt-6 border-t border-muted/50">
                        <h4 className="text-md font-medium flex items-center gap-2 mb-4">
                          <Users className="w-4 h-4 text-slate-500" /> Existing Admins
                        </h4>
                        <div className="bg-background/50 rounded-lg border border-muted overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/30">
                              <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {adminsList.map((admin) => (
                                <TableRow key={admin.id}>
                                  <TableCell className="font-medium text-sm">{admin.email}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                      onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                                    >
                                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <EditProductDialog
            product={editProduct}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSave={handleEditSave}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
