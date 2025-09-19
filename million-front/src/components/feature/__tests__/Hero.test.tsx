import { render, screen } from '@testing-library/react';
import { Hero } from '../hero';
import { Property } from '@/lib/types';
import '@testing-library/jest-dom';

const mockProperty: Property = {
  idProperty: 'prop1',
  name: 'Luxury Villa',
  address: '123 Ocean Drive',
  price: 5000000,
  year: 2022,
  idOwner: 'owner1',
  ownerName: 'John Doe',
  ownerPhoto: 'https://example.com/owner.jpg',
  image: 'https://example.com/villa.jpg',
};

describe('Hero', () => {
  it('renders the main title', () => {
    render(<Hero featuredProperty={null} />);
    expect(
      screen.getByText('Real estate for living and investments')
    ).toBeInTheDocument();
  });

  it('displays a message when there is no featured property', () => {
    render(<Hero featuredProperty={null} />);
    expect(
      screen.getByText('No featured property available at the moment.')
    ).toBeInTheDocument();
  });

  it('renders the featured property details when provided', () => {
    render(<Hero featuredProperty={mockProperty} />);

    // Check for property name in the image overlay and details section
    expect(screen.getByText(mockProperty.name)).toBeInTheDocument();

    // Check for property address
    expect(screen.getByText(mockProperty.address)).toBeInTheDocument();

    // Check for formatted price
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(mockProperty.price);
    expect(screen.getByText(formattedPrice)).toBeInTheDocument();

    // Check for owner name
    expect(screen.getByText(mockProperty.ownerName)).toBeInTheDocument();
  });

  it('renders the main image with the correct alt text', () => {
    render(<Hero featuredProperty={mockProperty} />);
    const image = screen.getByAltText(mockProperty.name);
    expect(image).toBeInTheDocument();
  });
});
