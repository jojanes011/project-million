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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOwners } from '@/lib/hooks/useOwners';
import { CreatePropertyPayload, Property } from '@/lib/types';
import { FileUpload } from './image-upload';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const createSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres.'),
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive('El precio debe ser un número positivo.')
  ),
  year: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1800, 'El año debe ser válido.')
      .max(new Date().getFullYear(), 'El año no puede ser en el futuro.')
  ),
  idOwner: z.string().uuid('Debe seleccionar un propietario válido.'),
  imageFile: z
    .instanceof(File, { message: 'Por favor, suba una imagen.' })
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Solo se aceptan formatos .jpg, .jpeg, .png y .webp.'
    )
    .optional(),
});

const updateSchema = z.object({
  price: z.preprocess(
    (val) => Number(val),
    z.number().positive('El precio debe ser un número positivo.')
  ),
});

interface PropertyFormProps {
  onSubmit: (values: CreatePropertyPayload) => void;
  isSubmitting: boolean;
  initialData?: Property;
}

export function PropertyForm({ onSubmit, isSubmitting, initialData }: PropertyFormProps) {
  const { mode } = usePropertyModalStore();
  const { data: owners, isLoading: isLoadingOwners } = useOwners();

  const isEditMode = mode === 'edit';
  const formSchema = isEditMode ? updateSchema : createSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      price: initialData?.price || 0,
      year: initialData?.year || new Date().getFullYear(),
      idOwner: initialData?.idOwner || '',
      imageFile: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isEditMode && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern Villa" {...field} />
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
                    <Input placeholder="e.g. 123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {!isEditMode && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Built</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 500000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingOwners}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {owners?.map((owner) => (
                        <SelectItem key={owner.idOwner} value={owner.idOwner}>
                          {owner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Property Image</FormLabel>
                  <FormControl>
                    <FileUpload onChange={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Price' : 'Create Property'}
        </Button>
      </form>
    </Form>
  );
}
