import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OwnerForm } from '../owner-form';
import '@testing-library/jest-dom';

describe('OwnerForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<OwnerForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birthday/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Owner Photo/i)).toBeInTheDocument();
  });

  it('displays validation errors when submitting with empty fields', async () => {
    render(<OwnerForm onSubmit={mockOnSubmit} isSubmitting={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Save Owner/i }));

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 3 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('La dirección debe tener al menos 5 caracteres.')).toBeInTheDocument();
      expect(screen.getByText('Por favor, ingrese una fecha válida.')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with the form data when fields are valid', async () => {
    render(<OwnerForm onSubmit={mockOnSubmit} isSubmitting={false} />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Birthday/i), { target: { value: '1990-05-15' } });

    // No simulamos la subida de archivo aquí, solo el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /Save Owner/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        address: '123 Main St',
        birthday: '1990-05-15',
        photoFile: undefined, // El archivo no se pasa directamente en este test simple
      });
    });
  });

  it('pre-fills form fields with initialData', () => {
    const initialData = {
      idOwner: 'owner-1',
      name: 'Jane Doe',
      address: '456 Oak Ave',
      birthday: '1985-10-20T00:00:00Z',
      photo: 'https://example.com/photo.jpg',
    };
    render(<OwnerForm onSubmit={mockOnSubmit} isSubmitting={false} initialData={initialData} />);

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('456 Oak Ave');
    expect(screen.getByLabelText(/Birthday/i)).toHaveValue('1985-10-20');
  });
});
