using Million.Application.Interfaces;
using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories
{
    public class PropertyImageRepository : IPropertyImageRepository
    {
        private readonly MillionDbContext _context;

        public PropertyImageRepository(MillionDbContext context)
        {
            _context = context;
        }

        public async Task<PropertyImage> AddAsync(PropertyImage propertyImage)
        {
            await _context.PropertyImages.InsertOneAsync(propertyImage);
            return propertyImage;
        }

        public async Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(Guid propertyId)
        {
            return await _context.PropertyImages.Find(pi => pi.IdProperty == propertyId).ToListAsync();
        }

        public async Task<PropertyImage?> GetByIdAsync(Guid imageId)
        {
            return await _context.PropertyImages.Find(pi => pi.IdPropertyImage == imageId).FirstOrDefaultAsync();
        }

        public async Task DeleteAsync(Guid imageId)
        {
            await _context.PropertyImages.DeleteOneAsync(pi => pi.IdPropertyImage == imageId);
        }
    }
}
