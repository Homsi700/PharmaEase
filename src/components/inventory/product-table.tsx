
"use client";

import type { Product } from '@/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProductAction } from '@/app/(dashboard)/inventory/actions';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useAppTranslation();
  const { formatPrice } = useCurrency();

  const handleDelete = async (id: string) => {
    if (confirm(t('confirmDeleteProduct'))) {
      const result = await deleteProductAction(id);
      if (result.success) {
        toast({ title: t("success"), description: t("productDeletedSuccessfully") });
        router.refresh(); 
      } else {
        toast({ variant: "destructive", title: t("error"), description: result.error || t("failedToDeleteProduct") });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(t('locale') === 'ar' ? 'ar-EG' : 'en-US');
    } catch (e) {
      return "Invalid Date";
    }
  };

  const isLowStock = (product: Product) => {
    const threshold = product.lowStockThreshold || 10; // Default threshold if not set
    return product.quantityInStock < threshold;
  };

  const isExpired = (expiryDate: string) => {
    try {
      const exp = new Date(expiryDate);
      const today = new Date();
      today.setHours(0,0,0,0); // Compare dates only
      return exp < today;
    } catch (e) {
      return false;
    }
  };

  const isSoonToExpire = (expiryDate: string, days: number = 30): boolean => {
    if (!expiryDate) return false;
    try {
      const exp = new Date(expiryDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      const soonDate = new Date(today);
      soonDate.setDate(soonDate.getDate() + days);
      return exp < soonDate && exp >= today; // Expiring soon but not yet expired
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('barcode')}</TableHead>
            <TableHead className="text-right">{t('sellingPrice')}</TableHead>
            <TableHead className="text-right">{t('stock')}</TableHead>
            <TableHead>{t('expiryDate')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                {t('noProductsFound')}
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell className="text-right">{formatPrice(product.sellingPrice)}</TableCell>
              <TableCell className="text-right">{product.quantityInStock}</TableCell>
              <TableCell>{formatDate(product.expiryDate)}</TableCell>
              <TableCell>
                {isExpired(product.expiryDate) ? (
                  <Badge variant="destructive">{t('expired')}</Badge>
                ) : isSoonToExpire(product.expiryDate) ? (
                  <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-white">{t('soonToExpire')}</Badge>
                ) : isLowStock(product) ? (
                  <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-white">{t('lowStock')}</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">{t('inStock')}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/inventory/edit/${product.id}`} passHref>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('edit')}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

    