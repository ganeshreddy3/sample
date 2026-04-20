import { Product } from '@/types/product';
import { TrustScore } from './TrustScore';
import { StatusBadge } from './StatusBadge';
import { VerifiedBadge } from './VerifiedBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Building2, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onReport?: () => void;
}

export function ProductCard({ product, onClick, onReport }: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-500 overflow-hidden border border-white/20 dark:border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 bg-white/70 dark:bg-black/40 backdrop-blur-xl relative h-full flex flex-col",
        product.isAdminVerified && "ring-1 ring-verified/30"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 opacity-90",
        product.status === 'genuine' ? "bg-gradient-to-r from-emerald-400 to-green-500" :
        product.status === 'suspicious' ? "bg-gradient-to-r from-amber-400 to-yellow-500" :
        "bg-gradient-to-r from-red-400 to-rose-500"
      )} />
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
            <Package className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <TrustScore score={product.trustScore} size="sm" showLabel={false} />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Building2 className="w-4 h-4 text-primary/70" />
              <span className="truncate">{product.manufacturer}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={product.status} size="sm" />
              <VerifiedBadge isAdminVerified={product.isAdminVerified} size="sm" />
            </div>

            {product.licenseDate && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>License: {product.licenseDate}</span>
              </div>
            )}

            {onReport && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReport();
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Fake Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
