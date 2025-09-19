import { render, screen } from '@testing-library/react';
import { Header } from '../header';
import '@testing-library/jest-dom';

// Mock the stores
jest.mock('@/lib/hooks/usePropertyModalStore', () => ({
  usePropertyModalStore: () => ({
    openModal: jest.fn(),
  }),
}));

jest.mock('@/lib/hooks/useOwnerModalStore', () => ({
  useOwnerModalStore: () => ({
    openModal: jest.fn(),
  }),
}));

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />);
    const logo = screen.getByAltText('Million Logo');
    expect(logo).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Condos')).toBeInTheDocument();
    expect(screen.getByText('Houses')).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('For rent')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<Header />);
    expect(screen.getByText('Create Property')).toBeInTheDocument();
    expect(screen.getByText('Create Owner')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });
});
