using Microsoft.AspNetCore.Mvc;
using Million.Application.Interfaces;
using Million.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using Million.Application.Wrappers;
using System.Collections.Generic;

namespace Million.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IPropertyImageRepository _propertyImageRepository;
        private readonly IPropertyTraceRepository _propertyTraceRepository;
        private readonly IOwnerRepository _ownerRepository;

        public PropertiesController(
            IPropertyRepository propertyRepository,
            IPropertyImageRepository propertyImageRepository,
            IPropertyTraceRepository propertyTraceRepository,
            IOwnerRepository ownerRepository)
        {
            _propertyRepository = propertyRepository;
            _propertyImageRepository = propertyImageRepository;
            _propertyTraceRepository = propertyTraceRepository;
            _ownerRepository = ownerRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetProperties(
            [FromQuery] string? name,
            [FromQuery] string? address,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var (properties, totalRecords) = await _propertyRepository.GetPropertiesAsync(
                name, address, minPrice, maxPrice, pageNumber, pageSize, null);

            var dtos = properties.Select(p => new PropertyDto
            {
                IdProperty = p.IdProperty,
                IdOwner = p.IdOwner,
                OwnerName = p.Owner?.Name ?? string.Empty,
                OwnerPhoto = p.Owner?.Photo ?? string.Empty,
                Name = p.Name,
                Address = p.Address,
                Price = p.Price,
                Year = p.Year,
                Image = p.PropertyImages.FirstOrDefault(pi => pi.Enabled)?.File ?? string.Empty
            }).ToList();

            var pagedResponse = new PagedResponse<PropertyDto>(dtos, pageNumber, pageSize, totalRecords);
            return Ok(pagedResponse);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetPropertyById(Guid id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            var propertyDto = new PropertyDto
            {
                IdProperty = property.IdProperty,
                IdOwner = property.IdOwner,
                OwnerName = property.Owner?.Name ?? string.Empty,
                OwnerPhoto = property.Owner?.Photo ?? string.Empty,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                Year = property.Year,
                Image = property.PropertyImages.FirstOrDefault(pi => pi.Enabled)?.File ?? string.Empty
            };
            return Ok(propertyDto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProperty([FromBody] CreatePropertyDto dto)
        {
            var ownerExists = await _ownerRepository.GetByIdAsync(dto.IdOwner) != null;
            if (!ownerExists)
            {
                return BadRequest("Owner not found.");
            }

            var property = new Property
            {
                Name = dto.Name,
                Address = dto.Address,
                Price = dto.Price,
                Year = dto.Year,
                IdOwner = dto.IdOwner
            };

            var newProperty = await _propertyRepository.AddAsync(property);
            return CreatedAtAction(nameof(GetPropertyById), new { id = newProperty.IdProperty }, newProperty);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProperty(Guid id, [FromBody] UpdatePropertyPriceDto dto)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            var oldPrice = property.Price;
            property.Price = dto.Price;

            await _propertyRepository.UpdateAsync(property);

            await _propertyTraceRepository.AddAsync(new PropertyTrace
            {
                IdProperty = property.IdProperty,
                DateSale = DateTime.UtcNow,
                Name = "Price Update",
                Value = dto.Price,
                Tax = oldPrice
            });

            return NoContent();
        }

        [HttpGet("{id:guid}/images")]
        public async Task<IActionResult> GetPropertyImages(Guid id)
        {
            var images = await _propertyImageRepository.GetByPropertyIdAsync(id);
            return Ok(images.Select(i => new PropertyImageDto { Id = i.IdPropertyImage, Url = i.File }));
        }



        [HttpDelete("{id:guid}/images/{imageId:guid}")]
        public async Task<IActionResult> DeletePropertyImage(Guid id, Guid imageId)
        {
            var image = await _propertyImageRepository.GetByIdAsync(imageId);
            if (image == null || image.IdProperty != id)
            {
                return NotFound();
            }

            await _propertyImageRepository.DeleteAsync(imageId);
            return NoContent();
        }

        [HttpPost("{id:guid}/images")]
        public async Task<IActionResult> AddImageToProperty(
            [FromRoute] Guid id,
            [FromBody] AddImageRequestDto request)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
            {
                return NotFound("Property not found");
            }

            var propertyImage = new PropertyImage
            {
                IdProperty = id,
                File = request.ImageUrl,
                Enabled = true,
                PublicId = request.PublicId
            };

            await _propertyImageRepository.AddAsync(propertyImage);

            return Ok(new { imageId = propertyImage.IdPropertyImage });
        }

        [HttpGet("{id:guid}/traces")]
        public async Task<IActionResult> GetPropertyTraces(Guid id)
        {
            var traces = await _propertyTraceRepository.GetByPropertyIdAsync(id);
            return Ok(traces);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProperty(Guid id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
            {
                return NotFound();
            }
            await _propertyRepository.DeleteAsync(id);
            return NoContent();
        }
    }

    // DTOs
    public class PropertyDto
    {
        public Guid IdProperty { get; set; }
        public Guid IdOwner { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhoto { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public string Image { get; set; } = string.Empty;
    }

    public class CreatePropertyDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Year { get; set; }
        public Guid IdOwner { get; set; }
    }

    public class UpdatePropertyPriceDto
    {
        public decimal Price { get; set; }
    }

    public class PropertyImageDto
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
