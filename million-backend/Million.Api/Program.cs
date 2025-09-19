using Million.Application.Interfaces;
using Million.Domain.Entities;
using Million.Infrastructure.Persistence;
using Million.Infrastructure.Repositories;
using System.Reflection;
using Million.Api.Middleware;
using FluentValidation;
using Serilog;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson;
using Microsoft.AspNetCore.Http;
using Million.Api.Controllers;
using Million.Api;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Configure Guid Serialization for MongoDB
BsonSerializer.RegisterSerializer(new GuidSerializer(BsonType.String));

// Configure MongoDB class mappings
BsonClassMap.RegisterClassMap<Owner>(cm =>
{
    cm.AutoMap();
    cm.MapIdMember(c => c.IdOwner).SetIdGenerator(GuidGenerator.Instance);
});

BsonClassMap.RegisterClassMap<Property>(cm =>
{
    cm.AutoMap();
    cm.MapIdMember(c => c.IdProperty).SetIdGenerator(GuidGenerator.Instance);
});

BsonClassMap.RegisterClassMap<PropertyImage>(cm =>
{
    cm.AutoMap();
    cm.MapIdMember(c => c.IdPropertyImage).SetIdGenerator(GuidGenerator.Instance);
});

BsonClassMap.RegisterClassMap<PropertyTrace>(cm =>
{
    cm.AutoMap();
    cm.MapIdMember(c => c.IdPropertyTrace).SetIdGenerator(GuidGenerator.Instance);
});

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Add services to the container.
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Million API",
        Version = "v1",
        Description = "API for managing properties and owners"
    });

    // Configure Swagger to handle IFormFile parameters
    c.MapType<IFormFile>(() => new Microsoft.OpenApi.Models.OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });

    // Configure Swagger to handle AddImageRequestDto
    c.MapType<AddImageRequestDto>(() => new Microsoft.OpenApi.Models.OpenApiSchema
    {
        Type = "object",
        Properties = new System.Collections.Generic.Dictionary<string, Microsoft.OpenApi.Models.OpenApiSchema>
        {
            ["ImageFile"] = new Microsoft.OpenApi.Models.OpenApiSchema
            {
                Type = "string",
                Format = "binary",
                Description = "Image file to upload"
            }
        }
    });
});

// Configure MongoDB settings
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));

// Register application services
builder.Services.AddSingleton<MillionDbContext>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MillionDbContext(settings.ConnectionString, settings.DatabaseName);
});
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPropertyTraceRepository, PropertyTraceRepository>();
builder.Services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();

// Register database seeder
builder.Services.AddScoped<DatabaseSeeder>();

// Register FluentValidation
builder.Services.AddValidatorsFromAssembly(Assembly.Load("Million.Application"));


builder.Services.AddControllers();

var app = builder.Build();
app.UseSerilogRequestLogging();
app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseCors(MyAllowSpecificOrigins);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

// Seed database if requested
if (args.Contains("--seed"))
{
    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
        await seeder.SeedAsync();
        return; // Exit after seeding
    }
}

app.Run();
