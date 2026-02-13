using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Portfolio.Api.Models;
using System.IO;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly ILogger<ContactController> _logger;
    private readonly IWebHostEnvironment _env;

    private const string ToEmail = "pandeypranjal264@gmail.com";

    public ContactController(
        IConfiguration config,
        ILogger<ContactController> logger,
        IWebHostEnvironment env)
    {
        _config = config;
        _logger = logger;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> Send(
        [FromBody] ContactRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request?.Name) ||
            string.IsNullOrWhiteSpace(request?.Email) ||
            string.IsNullOrWhiteSpace(request?.Message))
            return BadRequest("Name, Email and Message are required.");

        var password = _config["Smtp:Password"];
        if (string.IsNullOrWhiteSpace(password))
            return StatusCode(500, "SMTP password missing");

        var host = _config["Smtp:Host"] ?? "smtp.gmail.com";
        var port = _config.GetValue<int>("Smtp:Port", 587);
        var userName = _config["Smtp:UserName"] ?? ToEmail;

        // ✅ LOAD TEMPLATE
        var templatePath = Path.Combine(
            _env.ContentRootPath,
            "Templates",
            "ContactEmail.html"
        );

        if (!System.IO.File.Exists(templatePath))
            return StatusCode(500, "Email template not found");

        var html = await System.IO.File.ReadAllTextAsync(templatePath);

        // Replace placeholders
        html = html
            .Replace("{{name}}", request.Name)
            .Replace("{{email}}", request.Email)
            .Replace("{{service}}", request.Service)
            .Replace("{{message}}", request.Message);

        // Build message
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Portfolio Contact", userName));
        message.To.Add(new MailboxAddress("Pranjal", ToEmail));
        message.Subject = $"Portfolio contact: {request.Service} – {request.Name}";
        message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));

        var builder = new BodyBuilder
        {
            HtmlBody = html,
            TextBody =
                $"Name: {request.Name}\n" +
                $"Email: {request.Email}\n" +
                $"Service: {request.Service}\n\n" +
                $"Message:\n{request.Message}"
        };

        message.Body = builder.ToMessageBody();

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync(host, port, SecureSocketOptions.StartTls, cancellationToken);
            await client.AuthenticateAsync(userName, password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send contact email");
            return StatusCode(500, "Failed to send email.");
        }
    }
}