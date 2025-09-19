'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface FileUploadProps {
  onChange: (file?: File) => void;
  value?: File;
}

export function FileUpload({ onChange }: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onChange(undefined);
    // Reset the input value
    const input = document.getElementById('imageFile') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="relative">
      <Input
        id="imageFile"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {previewUrl ? (
        <div className="relative w-full h-64 rounded-md overflow-hidden">
          <Image src={previewUrl} alt="Image preview" layout="fill" objectFit="cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Label
          htmlFor="imageFile"
          className="
            cursor-pointer
            hover:opacity-70
            transition
            border-dashed 
            border-2 
            p-10 
            border-muted-foreground/50
            flex
            flex-col
            justify-center
            items-center
            gap-4
            text-muted-foreground
            w-full
            h-64
            rounded-md
          "
        >
          <ImagePlus size={40} />
          <span className="font-semibold text-center">Click to select an image</span>
        </Label>
      )}
    </div>
  );
}
