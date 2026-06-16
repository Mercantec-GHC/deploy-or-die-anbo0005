using Microsoft.AspNetCore.Mvc;

namespace MercantecApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() =>
        Ok(new
        {
            status = "ok",
            app = "Deploy Course Helper",
            timestamp = DateTime.UtcNow
        });
}
