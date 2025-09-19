'use client';

import { useProperties } from '@/lib/hooks/useProperties';
import { useFilterStore } from '@/lib/hooks/useFilterStore';
import { PropertyCard } from './property-card';
import { PagedResponse, Property } from '@/lib/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PropertyListProps {
  initialProperties: PagedResponse<Property> | null;
}

export function PropertyList({ initialProperties }: PropertyListProps) {
  const { filters, pagination, setPageNumber } = useFilterStore();
  const {
    data: pagedData,
    isLoading,
    isError,
    error,
  } = useProperties({ ...filters, ...pagination });

  const properties = pagedData?.data ?? initialProperties?.data ?? [];
  const totalPages = pagedData?.totalPages ?? initialProperties?.totalPages ?? 1;

  if (isLoading) {
    return <div className="text-center py-12">Loading properties...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">{error.message}</div>;
  }

  return (
    <div
      id="property-list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
    >
      {properties.map((property) => (
        <PropertyCard key={property.idProperty} property={property} />
      ))}
    </div>
  );
}
