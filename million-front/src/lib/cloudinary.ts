export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

export async function uploadToCloudinary(
  file: File,
  propertyId: string
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `properties/${propertyId}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary.');
  }

  return response.json();
}
