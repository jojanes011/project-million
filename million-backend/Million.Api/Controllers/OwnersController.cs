using Microsoft.AspNetCore.Mvc;
using Million.Application.Interfaces;
using Million.Domain.Entities;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace Million.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OwnersController : ControllerBase
    {
        private readonly IOwnerRepository _ownerRepository;

        public OwnersController(IOwnerRepository ownerRepository)
        {
            _ownerRepository = ownerRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetOwners()
        {
            var owners = await _ownerRepository.GetAllAsync();
            var ownerDtos = owners.Select(o => new OwnerDto
            {
                IdOwner = o.IdOwner,
                Name = o.Name
            });
            return Ok(ownerDtos);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOwner([FromBody] CreateOwnerDto dto)
        {
            var owner = new Owner
            {
                IdOwner = Guid.NewGuid(),
                Name = dto.Name,
                Address = dto.Address,
                Photo = dto.Photo,
                Birthday = dto.Birthday
            };

            await _ownerRepository.AddAsync(owner);

            return CreatedAtAction(nameof(GetOwners), new { id = owner.IdOwner }, owner.IdOwner);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateOwner(Guid id, [FromBody] UpdateOwnerDto dto)
        {
            var owner = await _ownerRepository.GetByIdAsync(id);
            if (owner == null)
            {
                return NotFound();
            }

            owner.Name = dto.Name;
            owner.Address = dto.Address;

            await _ownerRepository.UpdateAsync(owner);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteOwner(Guid id)
        {
            var owner = await _ownerRepository.GetByIdAsync(id);
            if (owner == null)
            {
                return NotFound();
            }
            await _ownerRepository.DeleteAsync(id);
            return NoContent();
        }
    }

    public class OwnerDto
    {
        public Guid IdOwner { get; set; }
        public string? Name { get; set; }
    }

    public class CreateOwnerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
    }

    public class UpdateOwnerDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
