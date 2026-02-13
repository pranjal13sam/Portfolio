using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Data;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/test-db")]
public class TestDbController : ControllerBase
{
    private readonly AppDbContext _context;

    public TestDbController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Test()
    {
        try
        {
            _context.Database.CanConnect();
            return Ok("Database connection successful ✅");
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}