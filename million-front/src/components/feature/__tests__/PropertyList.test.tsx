import { render, screen } from '@testing-library/react';
import { PropertyList } from '../property-list';
import { useProperties } from '@/lib/hooks/useProperties';
import { useFilterStore } from '@/lib/hooks/useFilterStore';
import { PagedResponse, Property } from '@/lib/types';

// Mock the hooks
jest.mock('@/lib/hooks/useProperties');
jest.mock('@/lib/hooks/useFilterStore');

const mockUseProperties = useProperties as jest.Mock;
const mockUseFilterStore = useFilterStore as jest.Mock;

const mockProperties: Property[] = [
    { idProperty: '1', name: 'Villa', address: '1 Main St', price: 100, year: 2020, idOwner: '1', ownerName: 'A', image: null },
    { idProperty: '2', name: 'Condo', address: '2 Main St', price: 200, year: 2021, idOwner: '2', ownerName: 'B', image: null },
];

const mockPagedResponse: PagedResponse<Property> = {
    pageNumber: 1,
    pageSize: 9,
    totalPages: 1,
    totalRecords: 2,
    data: mockProperties,
};

describe('PropertyList', () => {

    beforeEach(() => {
        mockUseFilterStore.mockReturnValue({
            filters: {},
            pagination: { pageNumber: 1, pageSize: 9 },
            setPageNumber: jest.fn(),
        });
    });

    it('should show loading state correctly', () => {
        mockUseProperties.mockReturnValue({ isLoading: true, isError: false, data: null });
        render(<PropertyList initialProperties={null} />);
        expect(screen.getByText(/Loading properties.../i)).toBeInTheDocument();
    });

    it('should show error state correctly', () => {
        mockUseProperties.mockReturnValue({ isLoading: false, isError: true, error: new Error('Failed to fetch') });
        render(<PropertyList initialProperties={null} />);
        expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
    });
    
    it('should show "no properties found" message when data is empty', () => {
        mockUseProperties.mockReturnValue({ isLoading: false, isError: false, data: { ...mockPagedResponse, data: [] } });
        render(<PropertyList initialProperties={null} />);
        expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
    });
    
    it('should render a list of properties when data is available', () => {
        mockUseProperties.mockReturnValue({ isLoading: false, isError: false, data: mockPagedResponse });
        render(<PropertyList initialProperties={null} />);
        
        expect(screen.getByText('Villa')).toBeInTheDocument();
        expect(screen.getByText('Condo')).toBeInTheDocument();
        expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
    });

     it('should render initial properties from the server', () => {
        // When initialData is present, useQuery is idle initially
        mockUseProperties.mockReturnValue({ isLoading: false, isError: false, data: null }); 
        render(<PropertyList initialProperties={mockPagedResponse} />);
        
        expect(screen.getByText('Villa')).toBeInTheDocument();
        expect(screen.getByText('Condo')).toBeInTheDocument();
    });
});
