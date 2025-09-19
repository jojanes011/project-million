import { Header } from '@/components/feature/header';
import { Hero } from '@/components/feature/hero';
import { PropertyList } from '@/components/feature/property-list';
import { getProperties } from '@/lib/api/properties';
import { PagedResponse, Property } from '@/lib/types';

export default async function Home() {
  let initialProperties: PagedResponse<Property> | null = null;
  try {
    // Fetch page 1 with 9 items by default on server
    initialProperties = await getProperties({ pageNumber: 1, pageSize: 9 });
  } catch (error) {
    console.error('Failed to fetch initial properties:', error);
  }

  const featuredProperty =
    initialProperties?.data?.[Math.floor(Math.random() * initialProperties.data.length)] || null;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Header />
          <Hero featuredProperty={featuredProperty} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <main>
          <PropertyList initialProperties={initialProperties} />
        </main>
      </div>
    </>
  );
}
