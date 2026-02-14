using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

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
                "https://portfolio-6twwtzw0w-pranjal13sams-projects.vercel.app"
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