using Million.Application.Interfaces;
using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Million.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly MillionDbContext _context;

        public PropertyRepository(MillionDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<Property> Properties, int TotalRecords)> GetPropertiesAsync(string? name, string? address, decimal? minPrice, decimal? maxPrice, int pageNumber, int pageSize, Guid? propertyId = null)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(name))
            {
                filter &= filterBuilder.Regex(p => p.Name, new BsonRegularExpression(name, "i"));
            }

            if (!string.IsNullOrEmpty(address))
            {
                filter &= filterBuilder.Regex(p => p.Address, new BsonRegularExpression(address, "i"));
            }

            if (minPrice.HasValue)
            {
                filter &= filterBuilder.Gte(p => p.Price, minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                filter &= filterBuilder.Lte(p => p.Price, maxPrice.Value);
            }

            if (propertyId.HasValue)
            {
                filter &= filterBuilder.Eq(p => p.IdProperty, propertyId.Value);
            }

            var countPipeline = _context.Properties.Aggregate()
                .Match(filter)
                .Count();
            
            var totalRecordsResult = await countPipeline.FirstOrDefaultAsync();
            var totalRecords = (int)(totalRecordsResult?.Count ?? 0);

            var dataPipeline = _context.Properties.Aggregate()
                .Match(filter)
                .Skip((pageNumber - 1) * pageSize)
                .Limit(pageSize)
                .Lookup("Owners", "IdOwner", "IdOwner", "OwnerInfo")
                .Lookup("PropertyImages", "idProperty", "idProperty", "PropertyImages")
                .Unwind("OwnerInfo", new AggregateUnwindOptions<BsonDocument> { PreserveNullAndEmptyArrays = true })
                .Project(new BsonDocument
                {
                    { "IdProperty", "$IdProperty" },
                    { "Name", "$Name" },
                    { "Address", "$Address" },
                    { "Price", "$Price" },
                    { "CodeInternal", "$CodeInternal" },
                    { "Year", "$Year" },
                    { "IdOwner", "$IdOwner" },
                    { "Owner", "$OwnerInfo" },
                    { "PropertyImages", "$PropertyImages" }
                });
            
            var propertiesBson = await dataPipeline.ToListAsync();
            var properties = propertiesBson.Select(bsonDoc => BsonSerializer.Deserialize<Property>(bsonDoc)).ToList();
            
            return (properties, totalRecords);
        }

        public async Task<Property?> GetByIdAsync(Guid id)
        {
            return await _context.Properties.Find(p => p.IdProperty == id).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(Property property)
        {
            await _context.Properties.ReplaceOneAsync(p => p.IdProperty == property.IdProperty, property);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _context.PropertyImages.DeleteManyAsync(pi => pi.IdProperty == id);
            await _context.Properties.DeleteOneAsync(p => p.IdProperty == id);
        }
        
        public async Task<Property> AddAsync(Property property)
        {
            await _context.Properties.InsertOneAsync(property);
            return property;
        }
    }
}
