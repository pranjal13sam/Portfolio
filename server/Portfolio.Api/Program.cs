using Microsoft.EntityFrameworkCore;
using Portfolio.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// HttpClient for SendGrid (email API – works on Render where SMTP ports are blocked)
builder.Services.AddHttpClient("SendGrid", client =>
{
    client.BaseAddress = new Uri("https://api.sendgrid.com/");
});
// HttpClient for Resend (alternative email API)
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
                "https://portfolio-pranjalpandey.vercel.app"
            )
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Log which email provider is configured (helps debug Render env vars)
var sendGridKey = builder.Configuration["SendGrid:ApiKey"] ?? builder.Configuration["SENDGRID_API_KEY"] ?? Environment.GetEnvironmentVariable("SendGrid__ApiKey") ?? Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
var resendKey = builder.Configuration["Resend:ApiKey"] ?? Environment.GetEnvironmentVariable("Resend__ApiKey");
var logger = app.Services.GetRequiredService<ILogger<Program>>();
if (!string.IsNullOrWhiteSpace(sendGridKey?.ToString()))
    logger.LogInformation("Email: SendGrid configured");
else if (!string.IsNullOrWhiteSpace(resendKey?.ToString()))
    logger.LogInformation("Email: Resend configured");
else
    logger.LogWarning("Email: SendGrid/Resend not set. Contact form will use SMTP (fails on Render).");

// ❌ Remove MapOpenApi()

app.UseCors();

// Only redirect to HTTPS when not in Development (avoids "Failed to determine the https port" when running without HTTPS)
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();