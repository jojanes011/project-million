using Million.Application.Interfaces;
using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories
{
    public class OwnerRepository : IOwnerRepository
    {
        private readonly MillionDbContext _context;

        public OwnerRepository(MillionDbContext context)
        {
            _context = context;
        }

        public async Task<Owner> AddAsync(Owner owner)
        {
            await _context.Owners.InsertOneAsync(owner);
            return owner;
        }

        public async Task<IEnumerable<Owner>> GetAllAsync()
        {
            return await _context.Owners.Find(_ => true).ToListAsync();
        }

        public async Task<Owner?> GetByIdAsync(Guid id)
        {
            return await _context.Owners.Find(o => o.IdOwner == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Owner owner)
        {
            await _context.Owners.ReplaceOneAsync(o => o.IdOwner == owner.IdOwner, owner);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _context.Owners.DeleteOneAsync(o => o.IdOwner == id);
        }
    }
}
