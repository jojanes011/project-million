'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFilterStore } from '@/lib/hooks/useFilterStore';
import { MapPin, Building, DollarSign, Search, X } from 'lucide-react';
import { PropertyFilterParams } from '@/lib/types';

export function FilterBar() {
  const { filters: globalFilters, setFilters, clearFilters } = useFilterStore();
  const [localFilters, setLocalFilters] = useState<PropertyFilterParams>(globalFilters);

  useEffect(() => {
    setLocalFilters(globalFilters);
  }, [globalFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleSearch = () => {
    setFilters(localFilters);
  };

  const handleClear = () => {
    clearFilters();
    setLocalFilters({
      name: undefined,
      address: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div id="filter-bar" className="p-6 bg-card rounded-2xl shadow-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={16} />
            <span>Location</span>
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="Enter an address"
            value={localFilters.address || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Property Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground">
            <Building size={16} />
            <span>Property Name</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Modern Villa"
            value={localFilters.name || ''}
            onChange={handleInputChange}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label htmlFor="minPrice" className="flex items-center gap-2 text-muted-foreground">
            <DollarSign size={16} />
            <span>Price Range</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="Min"
              value={localFilters.minPrice || ''}
              onChange={handleInputChange}
            />
            <Input
              name="maxPrice"
              type="number"
              placeholder="Max"
              value={localFilters.maxPrice || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button size="lg" className="w-full" onClick={handleSearch}>
            <Search size={18} className="mr-2" />
            Search
          </Button>
          <Button size="lg" variant="ghost" onClick={handleClear} className="px-3">
            <X size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
