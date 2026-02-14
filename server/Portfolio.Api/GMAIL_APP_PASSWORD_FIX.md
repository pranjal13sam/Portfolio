# Fix "535 Username and Password not accepted" – Gmail contact email

Gmail **only** accepts **App Passwords** for SMTP, not your normal Gmail password. If you see "Email login failed" or 535, do this:

## Step 1: Create a NEW Gmail App Password

1. Open: **https://myaccount.google.com/apppasswords**
2. Sign in with **pandeypranjal264@gmail.com**
3. If you don’t see “App passwords”:
   - Go to **Google Account → Security**
   - Turn **ON** “2-Step Verification”
   - Then open the App passwords link again
4. Click **“Select app”** → choose **“Mail”** (or **“Other”** and type “Portfolio”)
5. Click **“Generate”**
6. **Copy the 16-character password** (e.g. `abcd efgh ijkl mnop`). You can paste it with or without spaces.

## Step 2: Set the password and run the API

**Option A – Environment variable (recommended, no secrets in files)**

In **PowerShell** (run from the folder that contains the API project):

```powershell
cd C:\Users\pranjal.pandey\Downloads\Portfolio\server\Portfolio.Api
$env:Smtp__Password = "your16charapppassword"
dotnet run
```

Use the 16-character App Password **without spaces** (e.g. `abcdefghijklmnop`).

**Option B – User secrets**

```powershell
cd C:\Users\pranjal.pandey\Downloads\Portfolio\server\Portfolio.Api
dotnet user-secrets set "Smtp:Password" "your16charapppassword"
dotnet run
```

## Step 3: Check the logs

When you send a test from the contact form, the API log should show something like:

- `SMTP: using smtp.gmail.com:465, user pandeypranjal264@gmail.com, password length 16`
- Then either: `Contact email sent successfully` or the 535 error.

If **password length** is 0, the password is not being loaded – use Option A (environment variable) in the same terminal where you run `dotnet run`.

If **password length** is 16 but you still get 535, the App Password is wrong or revoked – create a **new** one in Step 1 and set it again in Step 2.

## Important

- Use the **App Password** from Step 1, not your normal Gmail password.
- Do not put the real password in `appsettings.json` (it’s in the repo). Use env var or user-secrets only.
