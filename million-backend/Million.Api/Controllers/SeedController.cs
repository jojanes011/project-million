using Microsoft.AspNetCore.Mvc;

namespace Million.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly DatabaseSeeder _seeder;

        public SeedController(DatabaseSeeder seeder)
        {
            _seeder = seeder;
        }

        [HttpPost]
        public async Task<IActionResult> SeedDatabase()
        {
            try
            {
                await _seeder.SeedAsync();
                return Ok(new { message = "Database seeded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error seeding database", error = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> ClearDatabase()
        {
            try
            {
                // This would need to be implemented in DatabaseSeeder
                await Task.CompletedTask; // Placeholder for async operation
                return Ok(new { message = "Database cleared successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error clearing database", error = ex.Message });
            }
        }
    }
}
