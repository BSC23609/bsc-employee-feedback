# BSC Employee Feedback System

![Bharat Steel Chennai](assets/logo.png)

**Bharat Steel (Chennai) Pvt. Ltd.** — Digital Employee Feedback Form

A self-hosted, branded employee feedback application with anonymous submission support, admin dashboard, and OneDrive integration for report management.

---

## Features

- **6-Section Feedback Form** — Profile, Work Environment, Management, Growth & Benefits, Culture & Leave, Final Thoughts
- **20 Rating Questions** + 7 Open Response fields
- **Anonymous Mode** — Employees can submit without revealing identity
- **Admin Dashboard** — Real-time stats, entry viewer (click ⚙ gear icon)
- **Export Options** — CSV, JSON, and printable individual PDF reports
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Branded UI** — BSC blue (#005A9C) color scheme with company logo
- **Local Storage** — All data stored in browser; export to OneDrive

---

## Departments Covered

Accounting | Marketing | Production | Despatch | Admin | HR

---

## Quick Start

### Option A: GitHub Pages (Free Hosting)

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source: main branch → / (root)**
3. Access at: `https://your-username.github.io/bsc-feedback-app/`

### Option B: Company Server

1. Copy all files to your web server document root
2. Access at: `http://your-server-ip/` or `http://feedback.bharatsteels.in/`

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed instructions.

---

## Folder Structure

```
bsc-feedback-app/
├── index.html              # Main application (single-page app)
├── assets/
│   └── logo.png            # Company logo
├── README.md               # This file
├── DEPLOYMENT_GUIDE.md     # Full hosting guide
├── docker-compose.yml      # Docker deployment (optional)
├── Dockerfile              # Docker image config
├── nginx.conf              # Nginx server config
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions auto-deploy
```

---

## OneDrive Integration

Export data from the Admin Dashboard and upload to:

```
OneDrive (preethi@bharatsteels.in)
└── EMPLOYEE FEEDBACK FORM
    ├── INDIVIDUAL REPORT/    ← PDF reports per employee
    └── CONSOLIDATED/         ← Master Excel + CSV exports
```

---

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JavaScript
- No frameworks, no build tools, no dependencies
- Works offline after first load
- Zero server-side processing required

---

## License

Internal use only — Bharat Steel (Chennai) Pvt. Ltd.

---

*Built for BSC HR Department*
