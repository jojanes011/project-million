import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from '../image-upload';
import '@testing-library/jest-dom';

// Mock de URL.createObjectURL y URL.revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-image-url');
global.URL.revokeObjectURL = jest.fn();

describe('FileUpload', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();
    (global.URL.revokeObjectURL as jest.Mock).mockClear();
  });

  it('renders the initial state with a prompt to select an image', () => {
    render(<FileUpload onChange={mockOnChange} />);
    expect(screen.getByText('Click to select an image')).toBeInTheDocument();
  });

  it('calls onChange and displays a preview when a file is selected', async () => {
    render(<FileUpload onChange={mockOnChange} />);
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    const input = screen.getByLabelText(/Click to select an image/i).previousElementSibling as HTMLInputElement;
    expect(input).not.toBeNull();

    await waitFor(() => {
        fireEvent.change(input!, {
            target: { files: [file] },
        });
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('Image preview')).toBeInTheDocument();
    expect(screen.getByAltText('Image preview')).toHaveAttribute('src', 'blob:http://localhost/mock-image-url');
  });

  it('clears the preview and calls onChange with undefined when the remove button is clicked', async () => {
    render(<FileUpload onChange={mockOnChange} />);
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    const input = screen.getByLabelText(/Click to select an image/i).previousElementSibling as HTMLInputElement;
    
    // Primero, subimos una imagen
    await waitFor(() => {
        fireEvent.change(input!, {
            target: { files: [file] },
        });
    });

    expect(screen.getByAltText('Image preview')).toBeInTheDocument();

    // Luego, la eliminamos
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByAltText('Image preview')).not.toBeInTheDocument();
    });
    
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
    expect(screen.getByText('Click to select an image')).toBeInTheDocument();
  });
});
