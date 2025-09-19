import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bookmark, BedDouble, Bath, HomeIcon, Calendar } from 'lucide-react';
import { FilterBar } from './filter-bar';
import { Property } from '@/lib/types';
import Link from 'next/link';
import { OptimizedImage } from '../ui/optimized-image';

interface HeroProps {
  featuredProperty: Property | null;
}

export function Hero({ featuredProperty }: HeroProps) {
  if (!featuredProperty) {
    return (
      <section className="flex flex-col space-y-8 mt-8">
        <h1 className="text-5xl font-bold text-card-foreground max-w-2xl font-playfair_display">
          Real estate for living and investments
        </h1>
        <div className="text-center py-12 text-gray-500 rounded-3xl bg-slate-100">
          <p>No featured property available at the moment.</p>
        </div>
        <FilterBar />
      </section>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(featuredProperty.price);

  return (
    <section id="hero-section" className="flex flex-col space-y-8 mt-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-card-foreground max-w-2xl font-playfair_display">
        Our Featured Property
      </h1>

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        {/* Image Section */}
        <Link
          href={`/property/${featuredProperty.idProperty}`}
          className="relative h-full min-h-[450px] col-span-2 rounded-3xl overflow-hidden block group"
        >
          <Image
            src={featuredProperty.image || '/images/placeholder-image.png'}
            alt={featuredProperty.name}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-8">
            <h2 className="text-3xl font-bold text-white font-playfair_display">
              {featuredProperty.name}
            </h2>
          </div>
        </Link>

        {/* Details Section */}
        <Card className="p-8 rounded-3xl w-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-card-foreground">
                {featuredProperty.address}
              </h3>
              <Button variant="ghost" size="icon">
                <Bookmark className="h-6 w-6 text-card-foreground" />
              </Button>
            </div>

            <p className="text-4xl font-bold mt-2 text-foreground">{formattedPrice}</p>

            <div className="grid grid-cols-2 gap-4 my-6 border-t border-b py-4">
              <div className="text-center">
                <BedDouble className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="font-semibold mt-1">4</p>
                <p className="text-sm text-muted-foreground">beds</p>
              </div>
              <div className="text-center">
                <Bath className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="font-semibold mt-1">3</p>
                <p className="text-sm text-muted-foreground">baths</p>
              </div>
              <div className="text-center">
                <HomeIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="font-semibold mt-1">1,868</p>
                <p className="text-sm text-muted-foreground">sqft</p>
              </div>
              <div className="text-center">
                <Calendar className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="font-semibold mt-1">{featuredProperty.year}</p>
                <p className="text-sm text-muted-foreground">year</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <OptimizedImage
                    src={featuredProperty.ownerPhoto}
                    alt={featuredProperty.ownerName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <AvatarFallback>{featuredProperty.ownerName.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-card-foreground">{featuredProperty.ownerName}</p>
                  <Badge variant="secondary">Owner</Badge>
                </div>
              </div>
              <Link href={`/property/${featuredProperty.idProperty}`}>
                <Button variant="outline">Contact</Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <Link href={`/property/${featuredProperty.idProperty}`} className="block w-full">
              <Button size="lg" className="w-full h-16 text-lg">
                <div>
                  <p>View Property Details</p>
                </div>
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <FilterBar />
    </section>
  );
}
