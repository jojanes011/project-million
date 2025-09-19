using Million.Domain.Entities;

namespace Million.Application.Interfaces
{
    public interface IPropertyImageRepository
    {
        Task<PropertyImage> AddAsync(PropertyImage propertyImage);
        Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(Guid propertyId);
        Task<PropertyImage?> GetByIdAsync(Guid imageId);
        Task DeleteAsync(Guid imageId);
    }
}
