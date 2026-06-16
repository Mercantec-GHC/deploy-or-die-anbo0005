using MercantecApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace MercantecApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TermsController : ControllerBase
{
    private readonly TermsService _terms;

    public TermsController(TermsService terms)
    {
        _terms = terms;
    }

    [HttpGet]
    public IActionResult GetAll([FromQuery] int? day)
    {
        return Ok(_terms.GetAll(day));
    }

    [HttpGet("days")]
    public IActionResult GetDays()
    {
        var days = _terms.GetDays()
            .Select(d => new { day = d.Day, title = d.Title, count = d.Count });
        return Ok(days);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        var term = _terms.GetById(id);
        return term is null ? NotFound() : Ok(term);
    }
}
