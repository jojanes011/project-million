'use client';

import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fill?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  fill = false,
}: OptimizedImageProps) {
  if (!src) {
    // Fallback a una imagen de placeholder si no hay src
    const placeholderProps = fill
      ? { layout: 'fill' as const, objectFit: 'cover' as const }
      : { width: width || 100, height: height || 100 };

    return (
      <Image
        src="/images/placeholder-image.png"
        alt="Placeholder"
        className={className}
        {...placeholderProps}
      />
    );
  }

  // Comprueba si la URL es de Cloudinary para optimizarla
  const isCloudinaryUrl = src.includes('res.cloudinary.com');

  const getOptimizedSrc = (w: number, h?: number) => {
    if (!isCloudinaryUrl) return src;
    return src.replace(
      '/upload/',
      `/upload/q_auto,f_auto,w_${w}${h ? `,h_${h},c_limit` : ''}/`
    );
  };

  const imageProps = fill
    ? {
        layout: 'fill' as const,
        objectFit: 'cover' as const,
        src: getOptimizedSrc(width || 800), // Usar un ancho por defecto para la optimización
      }
    : {
        width: width || 100,
        height: height || 100,
        src: getOptimizedSrc(width || 100, height),
      };

  return (
    <Image
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        console.error('Error al cargar imagen:', src);
        // Fallback a imagen de placeholder en caso de error
        e.currentTarget.srcset = '/images/placeholder-image.png';
        e.currentTarget.src = '/images/placeholder-image.png';
      }}
      {...imageProps}
    />
  );
}
