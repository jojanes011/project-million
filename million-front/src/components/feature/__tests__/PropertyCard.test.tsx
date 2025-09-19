import { render, screen } from '@testing-library/react';
import { PropertyCard } from '../property-card';
import { Property } from '@/lib/types';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

const mockProperty: Property = {
  idProperty: '123-abc',
  name: 'Luxury Beach House',
  address: '123 Ocean Ave, Miami',
  price: 1500000,
  year: 2022,
  idOwner: 'owner-456',
  ownerName: 'John Doe',
  ownerPhoto: 'https://example.com/owner.jpg',
  image: 'https://example.com/image.jpg',
};

describe('PropertyCard', () => {
  it('should render property details correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    // Check for name, address, and price
    expect(screen.getByText('Luxury Beach House')).toBeInTheDocument();
    expect(screen.getByText('123 Ocean Ave, Miami')).toBeInTheDocument();
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();

    // Check for stats
    expect(screen.getByText(/2022 Year/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('should link to the correct property details page', () => {
    render(<PropertyCard property={mockProperty} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/property/123-abc');
  });
});
