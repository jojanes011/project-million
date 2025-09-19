import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PropertyForm } from '../property-form';
import { Property } from '@/lib/types';
import '@testing-library/jest-dom';
import { usePropertyModalStore } from '@/lib/hooks/usePropertyModalStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock de hooks y componentes externos
jest.mock('@/lib/hooks/usePropertyModalStore');
jest.mock('@/lib/hooks/useOwners', () => ({
  useOwners: () => ({
    data: [
      { idOwner: 'owner-1', name: 'John Doe' },
      { idOwner: 'owner-2', name: 'Jane Smith' },
    ],
    isLoading: false,
  }),
}));

const mockUsePropertyModalStore = usePropertyModalStore as jest.Mock;

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('PropertyForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockUsePropertyModalStore.mockReturnValue({ mode: 'create' });
  });

  it('renders all fields for create mode', () => {
    render(
      <Wrapper>
        <PropertyForm onSubmit={mockOnSubmit} isSubmitting={false} />
      </Wrapper>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year Built/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Image/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <Wrapper>
        <PropertyForm onSubmit={mockOnSubmit} isSubmitting={false} />
      </Wrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('La dirección debe tener al menos 5 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('Debe seleccionar un propietario válido.')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    render(
      <Wrapper>
        <PropertyForm onSubmit={mockOnSubmit} isSubmitting={false} />
      </Wrapper>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Beautiful House' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByLabelText(/Year Built/i), { target: { value: '2020' } });
    fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '500000' } });
    
    // Simular selección de un propietario
    fireEvent.mouseDown(screen.getByLabelText(/Owner/i));
    await waitFor(() => screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('John Doe'));

    fireEvent.click(screen.getByRole('button', { name: /Create Property/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Beautiful House',
          address: '123 Test St',
          year: 2020,
          price: 500000,
          idOwner: 'owner-1',
        })
      );
    });
  });

  it('renders only the price field in edit mode', () => {
    mockUsePropertyModalStore.mockReturnValue({ mode: 'edit' });
    const initialData: Property = {
        idProperty: 'prop1', name: 'Old House', address: 'Old Address', price: 100000, year: 1990,
        idOwner: 'owner-1', ownerName: 'John Doe', ownerPhoto: '', image: ''
    };

    render(
      <Wrapper>
        <PropertyForm onSubmit={mockOnSubmit} isSubmitting={false} initialData={initialData} />
      </Wrapper>
    );

    expect(screen.queryByLabelText(/Name/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Address/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Price/i })).toBeInTheDocument();
  });
});
