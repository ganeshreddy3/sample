import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();
  const { data: products = [], isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'genuine' | 'suspicious' | 'fake'>('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <Header />

      <main className="flex-1 py-12 md:py-20 relative z-10 animate-in fade-in duration-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-sm border border-white/20 text-primary mb-6 transition-transform hover:scale-105 duration-300">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">{t('products.verified_badge')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-4">
              {t('products.db_title')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('products.db_desc')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                placeholder={t('products.search_ph')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/60 dark:bg-black/60 border-white/20 focus:ring-2 focus:ring-primary/50 shadow-inner rounded-2xl h-12 transition-all text-base"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-full md:w-56 bg-white/60 dark:bg-black/60 border-white/20 shadow-inner rounded-2xl h-12 transition-all text-base">
                <SelectValue placeholder={t('products.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('products.status_all')}</SelectItem>
                <SelectItem value="genuine">{t('products.status_genuine')}</SelectItem>
                <SelectItem value="suspicious">{t('products.status_suspicious')}</SelectItem>
                <SelectItem value="fake">{t('products.status_fake')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {t('products.showing_count', { count: filteredProducts.length })}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">{t('products.loading')}</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 shadow-sm">
              <Filter className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">{t('products.no_products')}</h3>
              <p className="text-muted-foreground">
                {t('products.try_adjust')}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
