'use client';

import { Property } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { History, Pencil, Trash2, Calendar, Building } from 'lucide-react';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';
import { usePropertyTraceModalStore } from '@/lib/hooks/usePropertyTraceModalStore';
import { useDeleteProperty } from '@/lib/hooks/useProperties';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { OptimizedImage } from '../ui/optimized-image';

interface PropertyDetailsClientProps {
  property: Property;
}

export function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  const router = useRouter();
  const { openModal } = usePropertyModalStore();
  const { openModal: openTraceModal } = usePropertyTraceModalStore();
  const deleteMutation = useDeleteProperty();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(property.price);

  const handleDelete = () => {
    deleteMutation.mutate(property.idProperty, {
      onSuccess: () => {
        router.push('/'); // Redirect to home page after deletion
      },
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 mt-8">
      {/* Main Content */}
      <div className="md:col-span-2 space-y-8">
        {/* Image, Description, Stats */}
        <Card className="rounded-3xl overflow-hidden shadow-lg">
          <div className="relative h-[500px]">
            <OptimizedImage
              src={property.image}
              alt={property.name}
              width={800}
              className="object-cover w-full h-full"
            />
          </div>
        </Card>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-playfair_display">{property.name}</h1>
          <p className="text-lg text-muted-foreground mt-2">{property.address}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center border-t border-b py-6 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <Building className="h-8 w-8 text-primary mb-2" />
            <span className="font-semibold">Residential</span>
            <span className="text-muted-foreground text-sm">Property Type</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <span className="font-semibold">{property.year}</span>
            <span className="text-muted-foreground text-sm">Year Built</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="p-8 rounded-2xl shadow-md text-center">
          <p className="text-sm text-muted-foreground tracking-wider uppercase">Asking Price</p>
          <p className="text-5xl font-bold mt-2">{formattedPrice}</p>
        </Card>

        <Card className="p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-lg">Owner Information</h3>
          <div className="flex items-center space-x-4 mt-4">
            <Avatar className="h-12 w-12">
              <OptimizedImage
                src={property.ownerPhoto}
                alt={property.ownerName}
                width={48}
                height={48}
                className="rounded-full"
              />
              <AvatarFallback>{property.ownerName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{property.ownerName}</p>
              <p className="text-sm text-muted-foreground">Property Owner</p>
            </div>
          </div>

          <div className="border-t my-6"></div>

          <h3 className="font-bold text-lg mb-4">Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start p-6 text-base"
              onClick={() => openModal('edit', property)}
            >
              <Pencil size={16} className="mr-4" /> Edit Property Price
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start p-6 text-base"
              onClick={() => openTraceModal(property.idProperty, property.name)}
            >
              <History size={16} className="mr-4" /> View Transaction History
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start p-6 text-base">
                  <Trash2 size={16} className="mr-4" /> Delete Property
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the property.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>
      </div>
    </div>
  );
}
