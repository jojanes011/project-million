import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyDetailsClient } from '../property-details-client';
import { Property } from '@/lib/types';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';
import { usePropertyTraceModalStore } from '@/lib/hooks/usePropertyTraceModalStore';
import { useDeleteProperty } from '@/lib/hooks/useProperties';
import { useRouter } from 'next/navigation';

// Mock hooks and router
jest.mock('@/lib/hooks/usePropertyModalStore');
jest.mock('@/lib/hooks/usePropertyTraceModalStore');
jest.mock('@/lib/hooks/useProperties');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockUsePropertyModalStore = usePropertyModalStore as jest.Mock;
const mockUsePropertyTraceModalStore = usePropertyTraceModalStore as jest.Mock;
const mockUseDeleteProperty = useDeleteProperty as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

const mockProperty: Property = {
    idProperty: '123-abc',
    name: 'Luxury Beach House',
    address: '123 Ocean Ave, Miami',
    price: 1500000,
    year: 2022,
    idOwner: 'owner-456',
    ownerName: 'John Doe',
    image: 'https://example.com/image.jpg',
};

describe('PropertyDetailsClient', () => {
  const mockOpenModal = jest.fn();
  const mockOpenTraceModal = jest.fn();
  const mockDeleteMutate = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePropertyModalStore.mockReturnValue({ openModal: mockOpenModal });
    mockUsePropertyTraceModalStore.mockReturnValue({ openModal: mockOpenTraceModal });
    mockUseDeleteProperty.mockReturnValue({ mutate: mockDeleteMutate });
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
  });

  it('should render property details', () => {
    render(<PropertyDetailsClient property={mockProperty} />);
    expect(screen.getByText('Luxury Beach House')).toBeInTheDocument();
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });

  it('should call openModal when "Edit" button is clicked', () => {
    render(<PropertyDetailsClient property={mockProperty} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(mockOpenModal).toHaveBeenCalledWith('edit', mockProperty);
  });

  it('should call openTraceModal when "View History" button is clicked', () => {
    render(<PropertyDetailsClient property={mockProperty} />);
    fireEvent.click(screen.getByRole('button', { name: /View History/i }));
    expect(mockOpenTraceModal).toHaveBeenCalledWith(mockProperty.idProperty, mockProperty.name);
  });

  it('should call delete mutation when deletion is confirmed', () => {
    render(<PropertyDetailsClient property={mockProperty} />);
    // Open the confirmation dialog first
    fireEvent.click(screen.getByRole('button', { name: /Delete Property/i }));
    // Then click the "Continue" button in the dialog
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    
    expect(mockDeleteMutate).toHaveBeenCalledWith(mockProperty.idProperty, expect.any(Object));
  });
});
