using Million.Domain.Entities;

namespace Million.Application.Interfaces
{
    public interface IPropertyTraceRepository
    {
        Task<PropertyTrace> AddAsync(PropertyTrace propertyTrace);
        Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(Guid propertyId);
    }
}
