using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly ILogger<ContactController> _logger;
    private readonly IWebHostEnvironment _env;
    private readonly IHttpClientFactory _httpClientFactory;

    private const string ToEmail = "pandeypranjal264@gmail.com";

    public ContactController(
        IConfiguration config,
        ILogger<ContactController> logger,
        IWebHostEnvironment env,
        IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _logger = logger;
        _env = env;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost]
    public async Task<IActionResult> Send(
        [FromBody] ContactRequest request,
        CancellationToken cancellationToken)
    {
        // ✅ Basic validation
        if (string.IsNullOrWhiteSpace(request?.Name) ||
            string.IsNullOrWhiteSpace(request?.Email) ||
            string.IsNullOrWhiteSpace(request?.Message))
            return BadRequest("Name, Email and Message are required.");

        // ✅ Load template (shared by Resend and SMTP)
        var templatePath = Path.Combine(
            _env.ContentRootPath,
            "Templates",
            "ContactEmail.html"
        );

        if (!System.IO.File.Exists(templatePath))
        {
            _logger.LogError("Template missing at {Path}", templatePath);
            return StatusCode(500, "Email template not found");
        }

        var html = await System.IO.File.ReadAllTextAsync(templatePath);
        html = html
            .Replace("{{name}}", request.Name)
            .Replace("{{email}}", request.Email)
            .Replace("{{service}}", request.Service)
            .Replace("{{message}}", request.Message);

        var subject = $"Portfolio contact: {request.Service} – {request.Name}";

        // ✅ SendGrid (works on Render) – try all possible env/config key names
        var sendGridApiKey = (
            _config["SendGrid:ApiKey"] ??
            _config["SENDGRID_API_KEY"] ??
            Environment.GetEnvironmentVariable("SendGrid__ApiKey") ??
            Environment.GetEnvironmentVariable("SENDGRID_API_KEY")
        )?.Trim();
        _logger.LogInformation("SendGrid key present: {Present}", !string.IsNullOrEmpty(sendGridApiKey));
        if (!string.IsNullOrEmpty(sendGridApiKey))
        {
            try
            {
                var fromEmail = (_config["SendGrid:From"] ?? Environment.GetEnvironmentVariable("SendGrid__From") ?? ToEmail).Trim();
                var fromName = _config["SendGrid:FromName"] ?? "Portfolio Contact";
                var payload = new
                {
                    personalizations = new[]
                    {
                        new { to = new[] { new { email = ToEmail } }, subject }
                    },
                    from = new { email = fromEmail, name = fromName },
                    content = new[] { new { type = "text/html", value = html } },
                    reply_to = new { email = request.Email, name = request.Name }
                };
                var httpClient = _httpClientFactory.CreateClient("SendGrid");
                using var req = new HttpRequestMessage(HttpMethod.Post, "v3/mail/send");
                req.Headers.TryAddWithoutValidation("Authorization", "Bearer " + sendGridApiKey);
                req.Content = JsonContent.Create(payload);
                var res = await httpClient.SendAsync(req, cancellationToken);
                if (!res.IsSuccessStatusCode)
                {
                    var err = await res.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogError("SendGrid API error {Code}: {Body}", res.StatusCode, err);
                    return StatusCode(500, "Failed to send email.");
                }
                _logger.LogInformation("Contact email sent via SendGrid");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact email via SendGrid");
                return StatusCode(500, "Failed to send email.");
            }
        }

        // ✅ Resend (alternative; SMTP ports 25/465/587 are blocked on Render)
        var resendApiKey = (_config["Resend:ApiKey"] ?? Environment.GetEnvironmentVariable("Resend__ApiKey"))?.Trim();
        if (!string.IsNullOrEmpty(resendApiKey))
        {
            try
            {
                var from = _config["Resend:From"] ?? "Portfolio Contact <onboarding@resend.dev>";
                var httpClient = _httpClientFactory.CreateClient("Resend");
                var payload = new
                {
                    from,
                    to = new[] { ToEmail },
                    subject,
                    html,
                    reply_to = request.Email
                };
                using var req = new HttpRequestMessage(HttpMethod.Post, "emails");
                req.Headers.TryAddWithoutValidation("Authorization", "Bearer " + resendApiKey);
                req.Content = JsonContent.Create(payload);
                var res = await httpClient.SendAsync(req, cancellationToken);
                if (!res.IsSuccessStatusCode)
                {
                    var err = await res.Content.ReadAsStringAsync(cancellationToken);
                    _logger.LogError("Resend API error {Code}: {Body}", res.StatusCode, err);
                    return StatusCode(500, "Failed to send email.");
                }
                _logger.LogInformation("Contact email sent via Resend");
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send contact email via Resend");
                return StatusCode(500, "Failed to send email.");
            }
        }

        // ✅ Fallback: SMTP (works locally; often blocked on Render/Heroku)
        _logger.LogWarning(
            "SendGrid and Resend API keys not set. Set SENDGRID_API_KEY (or SendGrid__ApiKey) on Render to use SendGrid. Using SMTP (will time out on Render).");
        var host = _config["Smtp:Host"] ?? "smtp.gmail.com";
        var port = _config.GetValue<int?>("Smtp:Port") ?? 587;
        var userName = (_config["Smtp:UserName"] ?? ToEmail).Trim();
        var password =
            _config["Smtp:Password"] ??
            Environment.GetEnvironmentVariable("Smtp__Password");
        password = password?.Trim()?.Replace(" ", "");

        if (string.IsNullOrWhiteSpace(password))
            return StatusCode(500, "SMTP password missing.");

        _logger.LogInformation("SMTP using {Host}:{Port}, user {User}", host, port, userName);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Portfolio Contact", userName));
        message.To.Add(new MailboxAddress("Pranjal", ToEmail));
        message.Subject = subject;
        message.ReplyTo.Add(new MailboxAddress(request.Name, request.Email));
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = html,
            TextBody =
                $"Name: {request.Name}\nEmail: {request.Email}\nService: {request.Service}\n\nMessage:\n{request.Message}"
        };
        message.Body = bodyBuilder.ToMessageBody();

        try
        {
            using var client = new SmtpClient();
            client.ServerCertificateValidationCallback = (_, _, _, _) => true;
            var options = port == 465 ? SecureSocketOptions.SslOnConnect
                : port == 587 ? SecureSocketOptions.StartTls
                : SecureSocketOptions.Auto;
            await client.ConnectAsync(host, port, options, cancellationToken);
            await client.AuthenticateAsync(userName, password, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
            _logger.LogInformation("Contact email sent via SMTP");
            return Ok();
        }
        catch (MailKit.Security.AuthenticationException ex)
        {
            _logger.LogError(ex, "SMTP authentication failed");
            return StatusCode(500, "Email login failed (check App Password).");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send contact email");
            return StatusCode(500, "Failed to send email.");
        }
    }
}