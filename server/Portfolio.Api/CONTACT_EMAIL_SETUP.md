# Contact form – receive emails to your Gmail

The contact form sends submissions to **pandeypranjal264@gmail.com** via your .NET API.

- **On Render (production):** Use **Resend** (SMTP ports are blocked on Render, so Gmail SMTP will time out).
- **Local:** You can use either Resend or Gmail SMTP.

---

## Production on Render – use Resend

Render blocks outbound SMTP (ports 25, 465, 587), so direct Gmail SMTP will fail with a timeout. The API supports **Resend** over HTTPS instead.

1. **Sign up:** [resend.com](https://resend.com) (free tier: 100 emails/day).
2. **Get API key:** Resend dashboard → API Keys → Create. Copy the key (starts with `re_`).
3. **Set on Render:** In your Render service → Environment:
   - Add: `Resend__ApiKey` = `re_your_api_key`
   - Optional: `Resend__From` = `Portfolio Contact <onboarding@resend.dev>` (default). With a verified domain you can use e.g. `Portfolio <noreply@yourdomain.com>`.
4. Redeploy. Contact form will send via Resend; emails still go to **pandeypranjal264@gmail.com**.

If **Resend__ApiKey** is set, the API uses Resend. If not, it falls back to SMTP (for local dev).

---

## Local – Gmail SMTP (optional)

If you don’t set `Resend__ApiKey`, the API uses Gmail SMTP (only works locally; use Resend on Render).

### If you see "535 Username and Password not accepted"

**You must use a Gmail App Password, not your normal Gmail password.** Google blocks normal passwords for SMTP. Follow the steps below to create an App Password and set it in the API.

## One-time setup (Gmail App Password)

1. **Turn on 2-Step Verification** (if not already):
   - Google Account → Security → 2-Step Verification → On.

2. **Create an App Password**:
   - Google Account → Security → 2-Step Verification → App passwords.
   - Create a new app password for "Mail" (or "Other" and name it "Portfolio").
   - Copy the 16-character password.

3. **Set the password in the API** (do not put it in `appsettings.json` if the file is committed):

   **Option A – User Secrets (recommended for local dev):**
   ```bash
   cd server/Portfolio.Api
   dotnet user-secrets set "Smtp:Password" "your-16-char-app-password"
   ```

   **Option B – Environment variable:**
   ```bash
   set Smtp__Password=your-16-char-app-password   # Windows CMD
   # or
   $env:Smtp__Password="your-16-char-app-password" # PowerShell
   ```

   **Option C – `appsettings.Development.json`:**
   Add (and do not commit this file if it contains the real password):
   ```json
   { "Smtp": { "Password": "your-16-char-app-password" } }
   ```

## Run and test

1. **Start the API:**
   ```bash
   cd server/Portfolio.Api
   dotnet run
   ```
   API will listen on **http://localhost:5047** (see `Properties/launchSettings.json`).

2. **Start the Angular app** (with proxy so `/api` goes to the backend):
   ```bash
   cd client
   npm start
   ```

3. Open the site, go to the Contact section, submit the form. You should get the email at **pandeypranjal264@gmail.com** and see the success notification.

If the API returns 500 "Email is not configured", the `Smtp:Password` is missing or wrong. Use one of the options above to set it.
