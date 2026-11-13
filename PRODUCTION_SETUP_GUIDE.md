# Nanny & MaisonCare Lëtzebuerg — Production Credentials, External Accounts & Setup Guide

This document lists every place in the codebase where **local development fallbacks, placeholder credentials, or seeded demo records** are currently used, along with the **exact external accounts you need to create** and step-by-step instructions to obtain the production keys/information.

---

## 🚀 Deploying Directly on Your **Site.eu Plus Plan** (Zero Extra Hosting or Email Accounts Needed!)

Because you have the **Site.eu Plus Plan**, your plan already includes:
1. **Node.js Server Profile & SSH Access** (to run this full-stack Next.js application)
2. **Persistent Disk Storage** (so [`src/lib/db.ts`](file:///Users/badman/Desktop/DESIGN/MaisonCare/src/lib/db.ts) automatically saves your database and uploaded `.pdf`/`.docx` CVs into `./data/` on your Site.eu server without needing Supabase!)
3. **Full Email Hosting & SMTP Server** (so you can create `info@yourdomain.lu` on Site.eu without needing Resend, Google Workspace, or Microsoft 365!)

### Step-by-Step Setup on Site.eu Plus Plan:
1. **Select the Node.js Server Profile on Site.eu:**
   - Log into your **Site.eu Dashboard** → select your domain → go to **Webhosting / Server Configuration**.
   - Choose the **Node.js** server profile (Node 20+ recommended) or open **Setup Node.js App** in the DirectAdmin control panel.
   - Set **Application Startup File** to: `server.js`
   - Set **Application Mode** to: `Production`
2. **Create Your Email Mailbox on Site.eu (or use Resend):**
   - In your Site.eu dashboard, go to **Email Accounts** → create `info@nannymaisoncare.lu` (or `webadmin@nannymaisoncare.lu`).
   - Or keep your verified **Resend** SMTP credentials (`smtp.resend.com`).
3. **Upload & Start the Application via SSH / Git / File Manager:**
   - Connect via SSH (provided in your Site.eu Plus plan dashboard) or upload the project files (excluding `node_modules` and `.next`).
   - Create `.env.local` in the project root on Site.eu with your production keys:
     ```env
     ADMIN_EMAIL=webadmin@nannymaisoncare.lu
     ADMIN_PASSWORD=YourChosenStrongPassword2026!
     ADMIN_SESSION_SECRET=replace_with_64_char_random_hex_string

     SMTP_HOST=smtp.resend.com
     SMTP_PORT=465
     SMTP_USER=resend
     SMTP_PASS=re_YourResendApiKeyHere

     NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAA...
     CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAA...

     GEMINI_API_KEY=AIzaSy...
     ```
   - Run:
     ```bash
     npm install
     npm run build
     npm run start
     # (Or if using DirectAdmin Node.js app selector, simply click "Restart" / "Run npm install" and "Run npm run build" in the UI)
     ```

---

## 📋 Quick Summary of Accounts You Need to Create

| # | Purpose | Recommended Platform to Create an Account On | Cost / Tier | Required or Optional? |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Business Email & Outbound SMTP** (Receiving booking/CV alerts & sending Admin direct replies) | **Microsoft 365**, **Google Workspace** (for `info@nannymaisoncare.lu`), or **Resend** (`resend.com`) / **Postmark** | Free tier (Resend: 3,000 emails/mo free) or existing domain mailbox | **Required** for real email delivery |
| **2** | **Cloud Database & Private CV File Storage** (Persisting bookings, jobs, reviews & `.pdf`/`.docx` CVs in production) | **Supabase** (`supabase.com`) — provides both PostgreSQL Database + Private Storage Bucket in one account | Free tier (500MB DB + 1GB File Storage) | **Required** if deploying to Vercel / Netlify |
| **3** | **Anti-Bot Form Protection** (Cloudflare Turnstile CAPTCHA-free shield) | **Cloudflare** (`dash.cloudflare.com`) | 100% Free (Unlimited Turnstile widgets) | **Recommended** (Currently uses built-in Honeypot + Time-Trap fallback) |
| **4** | **AI Chatbot LLM & Automatic `EN/FR/DE` Translation** | **OpenAI Platform** (`platform.openai.com`) or **Google AI Studio** (`aistudio.google.com`) + optional **DeepL** (`deepl.com/pro-api`) | Pay-as-you-go (~$5 credit lasts thousands of chats) or Gemini Free Tier | **Optional** (Currently uses built-in zero-hallucination local RAG engine) |
| **5** | **Web Hosting & Domain SSL** | **Vercel** (`vercel.com`) or **Render / Railway** | Free / Pro ($20/mo) | **Required** for going live on your `.lu` domain |

---

## 1. Outbound & Inbound Email Engine (`SMTP`)

### Where It Is Used in the Codebase
- **File:** `src/lib/emailService.ts` (`dispatchTransactionalEmail`, `sendBookingAdminAlert`, `sendJobApplicationAdminAlert`, `sendAiTicketAdminAlert`, `sendContactAdminAlert`, `sendReviewAdminAlert`, `sendAdminDirectReply`)
- **Current Fallback Behavior:**
  - Because `SMTP_HOST` and `SMTP_PASS` are currently placeholders (`smtp.example.com`), the app automatically falls back to `deliveryMethod: "LOCAL_OUTBOX"`.
  - Every triggered email is saved into `db.outboundEmails` so you can view and test it inside `/admin` → **Overview & KPIs → Recent Outbound Email Dispatch Log**.

### Which Account to Create & How to Get the Keys
You have **two options** (Option A is easiest if you already own `nannymaisoncare.lu` email; Option B is best for high-deliverability transactional emails):

#### **Option A: Use Your Existing `info@nannymaisoncare.lu` Mailbox (Google Workspace / Microsoft 365 / LUX-Hosting)**
1. Log into your email provider for `info@nannymaisoncare.lu`.
2. Enable **2-Step Verification** and generate an **App Password** (if using Google Workspace or Microsoft 365).
3. Copy your provider's SMTP details:
   - **Google Workspace:** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`
   - **Microsoft 365:** `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`
   - **Custom cPanel / Post.lu / EuroDNS:** `SMTP_HOST=mail.nannymaisoncare.lu`, `SMTP_PORT=587`

#### **Option B: Create a Free **Resend** Account (`https://resend.com`) — *Recommended***
1. Go to `https://resend.com` and sign up for a free account.
2. Go to **Domains** → click **Add Domain** → enter `nannymaisoncare.lu` and add the DNS records (DKIM/SPF) to your `.lu` domain registrar.
3. Go to **SMTP** or **API Keys** → click **Create API Key**.
4. Set your environment variables to:
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=465
   SMTP_USER=resend
   SMTP_PASS=re_YourResendApiKeyHere
   ```

---

## 2. Single-Administrator Authentication & Security Secrets

### Where It Is Used in the Codebase
- **Files:**
  - `.env.local` & `.env.example`
  - `src/app/api/admin/auth/route.ts` (Single-Admin Login check)
  - `src/lib/security.ts` (`createAdminSessionToken`, `verifyAdminSessionToken`)
  - `src/app/admin/page.tsx` (Admin Login UI)
- **Current Placeholder / Demo Behavior:**
  - `ADMIN_EMAIL` is set to `info@nannymaisoncare.lu`.
  - `ADMIN_PASSWORD` is set to `MaisonCareLux2026!`.
  - `ADMIN_SESSION_SECRET` is set to `maisoncare_letzebuerg_super_secret_session_key_2026`.
  - The `/admin` login page currently includes a convenience **"Auto-fill Admin Credentials"** button at the bottom of the card so you can test the dashboard with one click.

### What You Need to Provide for Production
No external account is needed here—you simply choose your own credentials:
1. Choose your final administrator email (`ADMIN_EMAIL`) and a strong password (`ADMIN_PASSWORD`).
2. Generate a random 64-character secret for `ADMIN_SESSION_SECRET` (you can run `openssl rand -hex 32` in your Mac terminal).
3. Before launching publicly, ask me to remove the **"Auto-fill Admin Credentials"** helper button from `src/app/admin/page.tsx`.

---

## 3. Production Database & Private CV File Storage

### Where It Is Used in the Codebase
- **Files:**
  - `src/lib/db.ts` (Stores `bookings`, `jobVacancies`, `jobApplications`, `reviews`, `aiTickets`, `contactMessages`, `outboundEmails`, `knowledgeBase`, and `settings`)
  - `src/app/api/jobs/apply/route.ts` (Saves candidate `.pdf` / `.doc` / `.docx` CVs to disk)
  - `src/app/api/admin/cv/[id]/route.ts` (Streams candidate CVs to the Admin)
- **Current Placeholder / Local Behavior:**
  - Currently uses a local JSON file (`maisoncare-db.json`) and a local private folder (`uploads/cvs/`) on your machine.
  - **Why this matters for production:** If you deploy to serverless platforms like **Vercel** or **Netlify**, the server's local filesystem is temporary (read-only / wiped on every redeploy). Therefore, new bookings, reviews, jobs, and uploaded CV PDFs must be stored in a cloud database and cloud storage bucket.

### Which Account to Create & How to Get the Keys
#### **Create a Free **Supabase** Account (`https://supabase.com`) — *Recommended (All-in-One Database + CV Storage)***
1. Go to `https://supabase.com` and create a free account.
2. Click **New Project**, name it `MaisonCare-Luxembourg`, choose the **Central EU (Frankfurt)** region (closest to Luxembourg for GDPR compliance and speed), and set a database password.
3. **Get Your Database & API Keys:**
   - Inside your Supabase project, go to **Project Settings (gear icon) → API** and copy:
     - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
     - `SUPABASE_SERVICE_ROLE_KEY` (Service Role secret key — used server-side only)
   - Go to **Project Settings → Database → Connection String** and copy:
     - `DATABASE_URL` (PostgreSQL URI)
4. **Create the Private CV Bucket:**
   - In the left sidebar, click **Storage** → **New Bucket** → name it `candidate-cvs` → keep **Public bucket OFF** (so CVs remain strictly private to the Admin).

*(Once you share those Supabase keys, I can swap `src/lib/db.ts` and the CV upload/download routes to Supabase Postgres + Supabase Storage in minutes without changing any UI).*

---

## 4. Cloudflare Turnstile (Anti-Bot Protection)

### Where It Is Used in the Codebase
- **Files:**
  - `src/components/security/TurnstileShield.tsx`
  - `src/lib/security.ts` (`validateAntiBot`)
- **Current Placeholder / Fallback Behavior:**
  - All forms currently run server-side honeypot + cryptographic elapsed-time trap validation (`validateAntiBot`) plus IP rate limiting (`checkRateLimit`).
  - `TurnstileShield.tsx` currently displays a self-contained verification badge using placeholder test keys (`1x00000000000000000000AA`) so it works on `localhost` without needing a registered domain.

### Which Account to Create & How to Get the Keys
#### **Create a Free **Cloudflare** Account (`https://dash.cloudflare.com`)**
1. Go to `https://dash.cloudflare.com/sign-up` and create a free account.
2. In the left sidebar, click **Turnstile** → **Add Widget**.
3. Enter Widget Name: `MaisonCare Lëtzebuerg Forms`.
4. Add Hostnames: `localhost` and your production domain (e.g., `nannymaisoncare.lu`).
5. Choose Widget Mode: **Managed** (or **Non-interactive**) and click **Create**.
6. Copy the two keys provided:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`

---

## 5. Multilingual AI Chatbot LLM & Auto-Translation API *(Optional Upgrade)*

### Where It Is Used in the Codebase
- **Files:**
  - `src/app/api/chat/route.ts` (Multilingual AI Concierge Chatbot)
  - `src/app/api/admin/jobs/route.ts` (Auto-generating `FR` and `DE` translations when the Admin posts a new job in `EN`)
- **Current Behavior:**
  - **Chatbot:** Currently uses a built-in, zero-cost, deterministic **RAG & keyword-grounding engine** in `src/app/api/chat/route.ts`. It detects `EN`, `FR`, and `DE`, answers questions strictly from your 5 service pillars, screening rules, FAQs, and live jobs, and triggers the inline Support Ticket form (`requiresEscalation: true`) whenever a visitor asks for custom pricing or bespoke arrangements.
  - **Job Translation:** If the Admin leaves the optional French/German fields blank when posting a new job in `/admin`, it currently duplicates the English text with a language tag unless translated manually.

### Which Account to Create (If You Want Live Generative AI & Instant Auto-Translation)
You can create **either** an OpenAI account **or** a Google Gemini account:

#### **Option A: Google Gemini API (`https://aistudio.google.com`) — *Has a Generous Free Tier***
1. Sign in at `https://aistudio.google.com` with your Google account.
2. Click **Get API Key** → **Create API Key**.
3. Copy `GEMINI_API_KEY`.

#### **Option B: OpenAI API (`https://platform.openai.com`)**
1. Sign up at `https://platform.openai.com`.
2. Go to **Settings → Billing** and add $5–$10 in prepaid credits.
3. Go to **API Keys** → **Create new secret key** (`gpt-4o-mini` costs fractions of a cent per 100 conversations).
4. Copy `OPENAI_API_KEY`.

---

## 6. Seeded Demo Data & Agency Contact Details to Review Before Launch

In addition to external API keys, the following **initial content placeholders / seed records** were added so you could test every workflow immediately:

1. **Agency Phone Number & Street Address (`src/lib/db.ts` line 359 & `/admin` → Settings):**
   - Currently set to:
     - **Email:** `info@nannymaisoncare.lu` (from `Contact Us.png`)
     - **Phone:** `+352 27 86 44 10` *(Placeholder Luxembourg number)*
     - **Address:** `Luxembourg-Ville, Grand Duchy of Luxembourg`
   - **What to provide:** Your real agency phone/WhatsApp number and exact Luxembourg street address (if you want them displayed in email footers or the Admin settings).

2. **Sample Seed Records in `src/lib/db.ts` (`createSeedDatabase`) & `src/lib/jobsData.ts`:**
   - **5 Sample Job Vacancies** on `/jobs` (e.g., *"Experienced nanny / family assistant wanted for a toddler — €5000 Full-time"* matching `Jobs.png` & `Jobs 2.png`).
   - **4 Approved Client Testimonials + 1 Pending Review** (`Sophie & Marc Schmit`, `Elena Rostova`, `Thomas Van Der Berg`, `Claire & Julien Weber`, and `Amélie Becker` in `PENDING` status).
   - **2 Sample Bookings** (`Camille & Henri Meyers` and `Dr. Lukas Hoffmann`).
   - **1 Sample Job Application & Sample PDF CV** (`Aline Ferreira`).
   - **1 Sample Escalated AI Chatbot Ticket** (`Martijn Van Outen`).
   - **Action before launch:** You can delete/edit any of these directly inside the `/admin` dashboard, or ask me to wipe the demo bookings/tickets/applications so the database starts 100% clean on launch day.


## Step 2: Test Real Email Alerts & Direct Replies

Once .env.local has your SMTP credentials:

We test an enquiry on the frontend (e.g. submit a test booking on the Homepage or Service Modal).
Confirm you receive the real instant email notification alert in your admin inbox.
Open the Admin Command Center (/admin), open that booking, and test sending a direct email reply to verify outbound client communication works.
## Step 3: Connect Live AI Chatbot / Turnstile (if keys provided)
If you have the Cloudflare Turnstile keys, we verify live bot challenges.
If you have an OpenAI or Gemini key, we wire it directly into /api/chat and /api/admin/jobs so automatic EN ↔ FR ↔ DE translation and dynamic LLM responses are live.
## Step 4: Clean Up Demo Seed Data & Admin Contact Info
Update your agency phone number and Luxembourg street address in /admin → AI Knowledge & Settings.
Remove or keep any of the sample demo jobs, reviews, or sample applications.
Remove the convenience "Auto-fill Admin Credentials" testing button from the /admin login screen.
## Step 5: Hosting on Site.eu (Last Step)
Once all the above is verified and working locally on your machine, we will deploy the ready-to-run platform straight to your Site.eu Plus server.
---

## 🔑 Complete Production `.env.local` Template

Once you have created the accounts above, your final `.env.local` (or Vercel Environment Variables) will look like this:

```env
# 1. Single-Admin Command Center Auth (/admin)
ADMIN_EMAIL=info@nannymaisoncare.lu
ADMIN_PASSWORD=Your_Strong_Production_Password_Here
ADMIN_SESSION_SECRET=replace_with_64_char_random_hex_string

# 2. Outbound Email / SMTP Server (Resend, Google Workspace, or Microsoft 365)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_your_production_smtp_api_key

# 3. Cloud Database & Private CV Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:password@db.your-project-id.supabase.co:5432/postgres

# 4. Cloudflare Turnstile Anti-Bot Protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAA...

# 5. Optional LLM API Key (for AI Chatbot & Auto-Translating Admin Job Posts)
GEMINI_API_KEY=AIzaSy...
# or OPENAI_API_KEY=sk-proj-...
```

