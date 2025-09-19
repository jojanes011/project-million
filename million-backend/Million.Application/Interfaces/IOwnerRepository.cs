using Million.Domain.Entities;

namespace Million.Application.Interfaces
{
    public interface IOwnerRepository
    {
        Task<Owner> AddAsync(Owner owner);
        Task<IEnumerable<Owner>> GetAllAsync();
        Task<Owner?> GetByIdAsync(Guid id);
        Task UpdateAsync(Owner owner);
        Task DeleteAsync(Guid id);
    }
}
