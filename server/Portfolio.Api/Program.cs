using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// HttpClient for Resend (email API – works on Render where SMTP ports are blocked)
builder.Services.AddHttpClient("Resend", client =>
{
    client.BaseAddress = new Uri("https://api.resend.com/");
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("PostgresConnection")
    )
);

// ❌ Remove AddOpenApi (not supported in your setup)

// CORS (IMPORTANT for Vercel frontend)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200",
                "https://portfolio-fawn-tau-40.vercel.app"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// ❌ Remove MapOpenApi()

app.UseCors();

// Only redirect to HTTPS when not in Development (avoids "Failed to determine the https port" when running without HTTPS)
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();