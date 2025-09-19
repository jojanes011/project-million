'use client';

import {
  Card,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { OptimizedImage } from '../ui/optimized-image';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
   }).format(property.price);

  return (
    <Link href={`/property/${property.idProperty}`} className="block h-full group">
      <Card className="overflow-hidden flex flex-col justify-between h-full group-hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-56 w-full">
          <OptimizedImage
            src={property.image}
            alt={property.name}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          <div>
            <CardTitle className="text-xl font-playfair_display">{property.name}</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">{property.address}</p>
            <p className="text-2xl font-bold mt-4">{formattedPrice}</p>
          </div>

          <div className="mt-4 pt-4 border-t flex-grow flex flex-col justify-end">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <OptimizedImage
                  src={property.ownerPhoto}
                  alt={property.ownerName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <AvatarFallback>{property.ownerName.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{property.ownerName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
