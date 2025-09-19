'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOwnerModalStore } from '@/lib/hooks/useOwnerModalStore';
import { OwnerForm } from './owner-form';
import { useCreateOwner } from '@/lib/hooks/useOwners';
import { CreateOwnerPayload } from '@/lib/types';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function OwnerModal() {
  const { isOpen, closeModal } = useOwnerModalStore();
  const createOwnerMutation = useCreateOwner();

  const handleSubmit = async (values: CreateOwnerPayload & { photoFile?: File }) => {
    const { photoFile, ...ownerData } = values;

    const promise = async () => {
      let photoUrl = 'url_de_placeholder.jpg'; // URL por defecto o de placeholder

      if (photoFile) {
        toast.info('Uploading photo to Cloudinary...');
        // Se usa un ID temporal o el nombre para la carpeta, ya que no tenemos ID de owner aún
        const tempIdForUpload = ownerData.name.replace(/\s+/g, '-').toLowerCase();
        const cloudinaryResult = await uploadToCloudinary(photoFile, `owner-${tempIdForUpload}`);
        photoUrl = cloudinaryResult.secure_url;
      }

      await createOwnerMutation.mutateAsync({
        ...ownerData,
        photo: photoUrl,
      });
    };

    toast.promise(promise(), {
      loading: 'Creating new owner...',
      success: 'Owner created successfully!',
      error: 'Failed to create owner.',
    });
  };

  useEffect(() => {
    if (createOwnerMutation.isSuccess) {
      closeModal();
    }
  }, [createOwnerMutation.isSuccess, closeModal]);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Owner</DialogTitle>
        </DialogHeader>
        <OwnerForm onSubmit={handleSubmit} isSubmitting={createOwnerMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}
