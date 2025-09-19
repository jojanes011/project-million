'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';
import { PropertyForm } from './property-form';
import {
  useCreateProperty,
  useUpdatePropertyPrice,
  useAddImageToProperty,
} from '@/lib/hooks/useProperties';
import { CreatePropertyPayload } from '@/lib/types';
import { useEffect } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';

export function PropertyModal() {
  const { isOpen, closeModal, mode, propertyToEdit } = usePropertyModalStore();

  const createPropertyMutation = useCreateProperty();
  const updatePropertyPriceMutation = useUpdatePropertyPrice();
  const addImageMutation = useAddImageToProperty();

  const isSubmitting =
    createPropertyMutation.isPending ||
    updatePropertyPriceMutation.isPending ||
    addImageMutation.isPending;

  const handleSubmit = async (values: CreatePropertyPayload & { imageFile?: File }) => {
    const { imageFile, ...propertyData } = values;

    if (mode === 'edit' && propertyToEdit) {
      if (values.price !== propertyToEdit.price) {
        toast.promise(
          updatePropertyPriceMutation.mutateAsync({
            id: propertyToEdit.idProperty,
            payload: { price: values.price },
          }),
          {
            loading: 'Updating price...',
            success: 'Price updated successfully!',
            error: 'Failed to update price.',
          }
        );
      }
    } else {
      // --- Create Mode ---
      const promise = async () => {
        // 1. Create property
        const newProperty = await createPropertyMutation.mutateAsync(propertyData);

        // 2. If image exists, upload to Cloudinary
        if (imageFile) {
          toast.info('Uploading image to Cloudinary...');
          const cloudinaryResult = await uploadToCloudinary(imageFile, newProperty.idProperty);

          // 3. Register image in backend
          await addImageMutation.mutateAsync({
            id: newProperty.idProperty,
            payload: {
              imageUrl: cloudinaryResult.secure_url,
              publicId: cloudinaryResult.public_id,
            },
          });
        }
        return newProperty;
      };

      toast.promise(promise(), {
        loading: 'Creating new property...',
        success: (data) => `Property "${data.idProperty}" created successfully!`,
        error: 'Failed to create property.',
      });
    }
  };

  useEffect(() => {
    if (createPropertyMutation.isSuccess || updatePropertyPriceMutation.isSuccess) {
      closeModal();
    }
  }, [createPropertyMutation.isSuccess, updatePropertyPriceMutation.isSuccess, closeModal]);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Property Price' : 'Create New Property'}
          </DialogTitle>
        </DialogHeader>
        <PropertyForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={mode === 'edit' ? propertyToEdit : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
