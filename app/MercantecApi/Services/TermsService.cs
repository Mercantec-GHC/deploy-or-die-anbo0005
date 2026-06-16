using System.Text.Json;
using MercantecApi.Models;

namespace MercantecApi.Services;

public sealed class TermsService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly IReadOnlyList<CourseTerm> _terms;

    public TermsService(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "terms.json");
        var json = File.ReadAllText(path);
        var file = JsonSerializer.Deserialize<TermsFile>(json, JsonOptions)
            ?? throw new InvalidOperationException("terms.json could not be loaded.");
        _terms = file.Terms.OrderBy(t => t.Day).ThenBy(t => t.Title).ToList();
    }

    public IReadOnlyList<CourseTerm> GetAll(int? day = null)
    {
        if (day is null)
        {
            return _terms;
        }

        return _terms.Where(t => t.Day == day).ToList();
    }

    public CourseTerm? GetById(string id) =>
        _terms.FirstOrDefault(t => string.Equals(t.Id, id, StringComparison.OrdinalIgnoreCase));

    public IReadOnlyList<(int Day, string Title, int Count)> GetDays() =>
        _terms
            .GroupBy(t => new { t.Day, t.DayTitle })
            .OrderBy(g => g.Key.Day)
            .Select(g => (g.Key.Day, g.Key.DayTitle, g.Count()))
            .ToList();
}
