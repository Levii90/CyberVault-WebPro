## Phase 20E-F Browser QA

Date: 2026-06-25

Scope:
- Incident type cards on `Pelaporan Insiden`
- Navbar search visibility on protected pages
- Forum filter chip spacing and wrapping

Environment:
- Dev server: `http://127.0.0.1:5173`
- Backend API: `http://localhost/CyberVault-v1.0/CyberVault-WebPro/backend/index.php`
- QA account: `hafid.test@example.com`

Method:
- Static audit on relevant React/CSS files
- Headless Edge browser QA via CDP for login, route navigation, DOM interaction, and submit verification
- API verification for auth and incident module readiness

Summary:
- Incident type cards are still wired to `formData.incidentType` and submit `incident_type` through the existing service contract.
- Navbar no longer renders a voice placeholder button on checked protected pages.
- Search input and `Cari` button remain visible on `/dashboard`, `/forum`, `/pelaporan-insiden`, and `/akun`.
- Incident report submit from the UI succeeded and returned a real backend `report_code`.
- Forum filter chips wrap cleanly and did not produce horizontal overflow on tested widths.

Evidence:
- UI submit created report code `CV-INC-20260625-426413`
- History list refreshed after submit
- Detail panel opened from history item after submit

Notes:
- Mobile width checks were validated through DOM/viewport automation and overflow checks.
- A few screenshots were captured during QA for spot checking in the local workspace.
