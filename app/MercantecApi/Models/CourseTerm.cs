namespace MercantecApi.Models;

public sealed class CourseTerm
{
    public required string Id { get; init; }
    public required int Day { get; init; }
    public required string DayTitle { get; init; }
    public required string Title { get; init; }
    public required string Summary { get; init; }
    public required string Body { get; init; }
    public required string Diagram { get; init; }
}

public sealed class TermsFile
{
    public required List<CourseTerm> Terms { get; init; }
}
