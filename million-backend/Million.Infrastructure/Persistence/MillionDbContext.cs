using MongoDB.Driver;
using Million.Domain.Entities;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;

namespace Million.Infrastructure.Persistence
{
    public class MillionDbContext
    {
        private readonly IMongoDatabase _database;

        public MillionDbContext(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IMongoCollection<Owner> Owners => _database.GetCollection<Owner>("Owners");
        public IMongoCollection<Property> Properties => _database.GetCollection<Property>("Properties");
        public IMongoCollection<PropertyImage> PropertyImages => _database.GetCollection<PropertyImage>("PropertyImages");
        public IMongoCollection<PropertyTrace> PropertyTraces => _database.GetCollection<PropertyTrace>("PropertyTraces");
    }
}
