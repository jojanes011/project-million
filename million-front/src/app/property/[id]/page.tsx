import { getPropertyById } from '@/lib/api/properties';
import { Header } from '@/components/feature/header';
import { PropertyDetailsClient } from '@/components/feature/property-details-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PropertyDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Header />
        <PropertyDetailsClient property={property} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch property:', error);
    return (
      <>
        <Header />
        <div className="text-center py-20 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold font-playfair_display">Property Not Found</h1>
          <p className="text-muted-foreground mt-4">
            We couldn&apos;t find the property you were looking for. It might have been sold, removed, or
            the link may be incorrect.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">Go Back to Homepage</Link>
          </Button>
        </div>
      </>
    );
  }
}
