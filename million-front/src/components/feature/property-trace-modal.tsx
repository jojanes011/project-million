'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePropertyTraceModalStore } from '@/lib/hooks/usePropertyTraceModalStore';
import { usePropertyTraces } from '@/lib/hooks/usePropertyTraces';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

export function PropertyTraceModal() {
  const { isOpen, closeModal, propertyInfo } = usePropertyTraceModalStore();
  const { data: traces, isLoading, isError } = usePropertyTraces(propertyInfo?.id ?? '');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>{propertyInfo?.name}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500">Failed to load transaction history.</p>
            </div>
          )}
          {!isLoading && !isError && traces && traces.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traces.map((trace, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{formatDate(trace.dateSale)}</TableCell>
                    <TableCell>{trace.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(trace.value)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{formatCurrency(trace.tax)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && !isError && (!traces || traces.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No transaction history found for this property.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
