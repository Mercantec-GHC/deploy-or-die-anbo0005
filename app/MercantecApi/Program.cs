var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<MercantecApi.Services.TermsService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var headers = ctx.Context.Response.Headers;
        if (ctx.File.Name.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
        {
            headers.CacheControl = "no-cache, no-store, must-revalidate";
        }
        else if (ctx.File.Name.EndsWith(".css", StringComparison.OrdinalIgnoreCase)
                 || ctx.File.Name.EndsWith(".js", StringComparison.OrdinalIgnoreCase))
        {
            headers.CacheControl = "public, max-age=0, must-revalidate";
        }
    }
});

app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();
