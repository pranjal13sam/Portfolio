# Contact form – receive emails to your Gmail

The contact form sends submissions to **pandeypranjal264@gmail.com** via your .NET API using Gmail SMTP.

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
