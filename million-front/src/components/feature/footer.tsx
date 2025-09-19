'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-card text-card-foreground border-t mt-16">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-4">
              <Image src="/images/million-logo.svg" alt="Million Logo" width={150} height={150} />
            </Link>
            <p className="text-sm text-slate-600">
              Your partner in finding the perfect luxury property.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Condos
              </Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Houses
              </Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">
                Commercial
              </Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">
                For Rent
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Contact Us</h3>
            <ul className="text-sm space-y-2">
              <li>123 Luxury Lane, Miami, FL</li>
              <li>contact@million.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-800">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-8 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Million Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
