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

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProductAction(id);
      if (result.success) {
        toast({ title: "Success", description: "Product deleted successfully." });
        router.refresh(); // Refresh data
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const isLowStock = (product: Product) => {
    const threshold = product.lowStockThreshold || 10; // Default low stock threshold
    return product.quantityInStock < threshold;
  }

  const isExpired = (expiryDate: string) => {
    try {
      return new Date(expiryDate) < new Date();
    } catch (e) {
      return false;
    }
  }

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Barcode</TableHead>
            <TableHead className="text-right">Selling Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-24">
                No products found.
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.barcode}</TableCell>
              <TableCell className="text-right">${product.sellingPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">{product.quantityInStock}</TableCell>
              <TableCell>{formatDate(product.expiryDate)}</TableCell>
              <TableCell>
                {isExpired(product.expiryDate) ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : isLowStock(product) ? (
                  <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-white">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">In Stock</Badge>
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
                        Edit
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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
