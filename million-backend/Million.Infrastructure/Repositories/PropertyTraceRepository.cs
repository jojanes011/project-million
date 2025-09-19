using Million.Application.Interfaces;
using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using MongoDB.Driver;

namespace Million.Infrastructure.Repositories
{
    public class PropertyTraceRepository : IPropertyTraceRepository
    {
        private readonly MillionDbContext _context;

        public PropertyTraceRepository(MillionDbContext context)
        {
            _context = context;
        }

        public async Task<PropertyTrace> AddAsync(PropertyTrace propertyTrace)
        {
            await _context.PropertyTraces.InsertOneAsync(propertyTrace);
            return propertyTrace;
        }

        public async Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(Guid propertyId)
        {
            return await _context.PropertyTraces.Find(pt => pt.IdProperty == propertyId).ToListAsync();
        }
    }
}
