import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../filter-bar';
import { useFilterStore } from '@/lib/hooks/useFilterStore';

// Mock the Zustand store
jest.mock('@/lib/hooks/useFilterStore');

// A reusable mock implementation
const mockUseFilterStore = useFilterStore as unknown as jest.Mock;

describe('FilterBar', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockSetFilters.mockClear();
    mockUseFilterStore.mockReturnValue({
      filters: {
        name: '',
        address: '',
        minPrice: undefined,
        maxPrice: undefined,
      },
      setFilters: mockSetFilters,
    });
  });

  it('should render all filter inputs and search button', () => {
    render(<FilterBar />);

    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year Built/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('should call setFilters when user types in the location input', () => {
    render(<FilterBar />);

    const locationInput = screen.getByLabelText(/Location/i);
    fireEvent.change(locationInput, { target: { value: 'New York' } });

    expect(mockSetFilters).toHaveBeenCalledTimes(1);
    expect(mockSetFilters).toHaveBeenCalledWith({ address: 'New York' });
  });

  it('should call setFilters with the correct price when min price is entered', () => {
    render(<FilterBar />);
    const minPriceInput = screen.getByPlaceholderText('Min');
    fireEvent.change(minPriceInput, { target: { value: '100000' } });

    expect(mockSetFilters).toHaveBeenCalledWith({ minPrice: '100000' });
  });

});
