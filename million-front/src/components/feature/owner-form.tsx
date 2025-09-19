'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Owner, CreateOwnerPayload } from '@/lib/types';
import { FileUpload } from './image-upload';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ownerSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres.'),
  birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Por favor, ingrese una fecha válida.',
  }),
  photoFile: z
    .instanceof(File, { message: 'Por favor, suba una imagen.' })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.'
    )
    .optional(),
});

interface OwnerFormProps {
  onSubmit: (values: CreateOwnerPayload & { photoFile?: File }) => void;
  isSubmitting: boolean;
  initialData?: Owner;
}

export function OwnerForm({ onSubmit, isSubmitting, initialData }: OwnerFormProps) {
  const form = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      birthday: initialData ? new Date(initialData.birthday).toISOString().split('T')[0] : '',
      photoFile: undefined,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((formValues) => onSubmit({ ...formValues, photo: '' }))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 456 Oak Ave" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photoFile"
          render={({ field: { onChange } }) => (
            <FormItem>
              <FormLabel>Owner Photo</FormLabel>
              <FormControl>
                <FileUpload onChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Owner'}
        </Button>
      </form>
    </Form>
  );
}
