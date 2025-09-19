'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';
import { useOwnerModalStore } from '@/lib/hooks/useOwnerModalStore';
import { HelpCircle } from 'lucide-react';
import { useTour } from '@/lib/hooks/useTour';

export function Header() {
  const { openModal: openPropertyModal } = usePropertyModalStore();
  const { openModal: openOwnerModal } = useOwnerModalStore();
  const { startTour } = useTour();

  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/million-logo.svg" alt="Million Logo" width={200} height={200} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#condos" className="hover:text-primary transition-colors">
            Condos
          </Link>
          <Link href="#houses" className="hover:text-primary transition-colors">
            Houses
          </Link>
          <Link href="#commercial" className="hover:text-primary transition-colors">
            Commercial
          </Link>
          <Link href="#for-rent" className="hover:text-primary transition-colors">
            For rent
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            id="create-property-btn"
            variant="outline"
            onClick={() => openPropertyModal('create')}
          >
            Create Property
          </Button>
          <Button id="create-owner-btn" variant="outline" onClick={() => openOwnerModal()}>
            Create Owner
          </Button>
          <Button>Log in</Button>
          <Button variant="ghost" size="icon" onClick={startTour}>
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
