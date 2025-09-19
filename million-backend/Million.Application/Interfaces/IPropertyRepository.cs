using Million.Domain.Entities;

namespace Million.Application.Interfaces
{
    public interface IPropertyRepository
    {
        Task<(IEnumerable<Property> Properties, int TotalRecords)> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice, int pageNumber, int pageSize, Guid? propertyId = null);
        Task<Property> AddAsync(Property property);
        Task<Property?> GetByIdAsync(Guid id);
        Task UpdateAsync(Property property);
        Task DeleteAsync(Guid id);
    }
}
