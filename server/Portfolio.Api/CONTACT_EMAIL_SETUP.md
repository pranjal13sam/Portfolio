# Contact form – receive emails to your Gmail

The contact form sends submissions to **pandeypranjal264@gmail.com** via your .NET API.

- **On Render (production):** Use **SendGrid** or Resend (SMTP ports are blocked on Render).
- **Local:** You can use SendGrid, Resend, or Gmail SMTP.

---

## Production on Render – use SendGrid

Render blocks outbound SMTP, so use SendGrid’s HTTPS API.

1. **SendGrid:** Create an account at [sendgrid.com](https://sendgrid.com) and create an API key (Settings → API Keys → Create). Copy the key.
2. **Verify sender (one-time):** All contact form messages are sent **to** you (pandeypranjal264@gmail.com). The email still has a “From” line (e.g. “Portfolio Contact”); SendGrid requires that address to be verified so they know you’re allowed to send as it. Use **your own email** as the verified sender: SendGrid → **Settings → Sender Authentication → Single Sender Verification → Create New**. Enter your name and **pandeypranjal264@gmail.com**. SendGrid will email that inbox a verification link; click it. After that, the API can send contact form emails to you with no further setup.
3. **Set on Render:** In your Render service → Environment, add:
   - `SendGrid__ApiKey` = `SG.your_actual_api_key`  
   - Or use the name SendGrid often suggests: `SENDGRID_API_KEY` = `SG.your_actual_api_key`
   - Optional: `SendGrid__From` = `pandeypranjal264@gmail.com` (defaults to your receive address). Must be a verified sender in SendGrid.
   - Optional: `SendGrid__FromName` = `Portfolio Contact`
4. **Redeploy.** Contact form will send via SendGrid to **pandeypranjal264@gmail.com**.

The API checks for SendGrid first (`SendGrid__ApiKey` or `SENDGRID_API_KEY`), then Resend, then SMTP.

---

## Production on Render – alternative: Resend

You can use Resend instead of SendGrid.

1. **Sign up:** [resend.com](https://resend.com). Get API key (starts with `re_`).
2. **Set on Render:** `Resend__ApiKey` = `re_your_api_key`. Optional: `Resend__From` = `Portfolio Contact <onboarding@resend.dev>`.
3. Redeploy.

---

## Local – Gmail SMTP (optional)

If you don’t set `SendGrid__ApiKey`/`SENDGRID_API_KEY` or `Resend__ApiKey`, the API uses Gmail SMTP (only works locally; use SendGrid or Resend on Render).

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
