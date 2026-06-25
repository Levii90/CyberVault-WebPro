# Frontend Route Inventory

## Active Routes

| Path | Page Component | Access | Status | Notes |
| --- | --- | --- | --- | --- |
| `/` | Redirect | Public entry | Active | Redirects to `/login` or `/dashboard` based on auth state. |
| `/login` | `Login.jsx` | Guest | Active | Redirects to `/dashboard` when authenticated. |
| `/register` | `Register.jsx` | Guest | Active | Guest-only route. |
| `/reset-password` | `ResetPassword.jsx` | Guest | Active | Guest-only route. |
| `/dashboard` | `Dashboard.jsx` | Protected | Active | Sidebar: Beranda. |
| `/timeline` | `Timeline.jsx` | Protected | Active | Sidebar: Timeline. |
| `/notifikasi` | `Notifikasi.jsx` | Protected | Active | Sidebar: Notifikasi. |
| `/akun` | `Akun.jsx` | Protected | Active | Sidebar: Akun. |
| `/pusat-edukasi` | `PusatEdukasi.jsx` | Protected | Active | Sidebar: Pusat Edukasi. |
| `/pelaporan-insiden` | `PelaporanInsiden.jsx` | Protected | Active | Sidebar: Pelaporan Insiden Digital. |
| `/informasi-peringatan` | `InformasiPeringatan.jsx` | Protected | Active | Sidebar: Pusat Informasi & Peringatan. |
| `/sertifikat-penilaian` | `SertifikatPenilaian.jsx` | Protected | Active | Sidebar: Sertifikat dan Penilaian. |
| `/forum` | `Forum.jsx` | Protected | Active | Sidebar: Forum Kesadaran Digital. |
| `/asesmen` | `Asesmen.jsx` | Protected | Active | Sidebar: Asesmen Keamanan Digital. |
| `/pengaturan` | `Pengaturan.jsx` | Protected | Active | Sidebar: Pengaturan. |
| `/pusat-bantuan` | `PusatBantuan.jsx` | Protected | Active | Sidebar: Pusat Bantuan. |
| `/logout` | `Logout.jsx` | Protected | Active | Canonical logout route. |
| `*` | `TidakDitemukanPage.jsx` | Public | Active | Unknown route handler after valid app root. |

## Sidebar Route Mapping

| Sidebar Label | Path | Route Status |
| --- | --- | --- |
| Beranda | `/dashboard` | Valid |
| Timeline | `/timeline` | Valid |
| Notifikasi | `/notifikasi` | Valid |
| Akun | `/akun` | Valid |
| Pusat Edukasi | `/pusat-edukasi` | Valid |
| Pelaporan Insiden Digital | `/pelaporan-insiden` | Valid |
| Pusat Informasi & Peringatan | `/informasi-peringatan` | Valid |
| Sertifikat dan Penilaian | `/sertifikat-penilaian` | Valid |
| Forum Kesadaran Digital | `/forum` | Valid |
| Asesmen Keamanan Digital | `/asesmen` | Valid |
| Pengaturan | `/pengaturan` | Valid |
| Pusat Bantuan | `/pusat-bantuan` | Valid |
| Keluar | `/logout` | Valid |

## Alias Routes

| Alias Path | Redirect Target | Reason |
| --- | --- | --- |
| `/keluar` | `/logout` | Backward compatibility with old menu/search links. |
| `/pelaporan-insiden-digital` | `/pelaporan-insiden` | Legacy verbose slug. |
| `/pusat-informasi-dan-peringatan` | `/informasi-peringatan` | Legacy verbose slug. |
| `/sertifikat-dan-penilaian` | `/sertifikat-penilaian` | Legacy verbose slug. |
| `/forum-kesadaran-digital` | `/forum` | Legacy verbose slug. |
| `/asesmen-keamanan-digital` | `/asesmen` | Legacy verbose slug. |

## Duplicate Candidates

| File | Status | Recommendation |
| --- | --- | --- |
| `src/views/pages/AccountPage.jsx` | Duplicate of `Akun.jsx` | Converted to compatibility re-export to avoid duplicated logic. |
| `src/views/pages/BerandaPage.jsx` | Alias of `Dashboard.jsx` | Keep as re-export unless route cleanup later removes the need. |

## Unused or Stale Candidates

| File | Status | Notes |
| --- | --- | --- |
| `src/views/pages/PlaceholderPage.jsx` | Unused candidate | Not referenced by active routes. Keep until broader page audit. |
| `src/views/layouts/CyberVaultLayout.jsx` | Stale candidate | Legacy layout not referenced by current `App.jsx`. |

## Route Mismatch Found

- Build entry under `/dist/` was treated as an unknown route because `BrowserRouter` had no `basename`.
- Root route `/` always redirected to `/login`, even when the user already had an active session.
- Logout search/sidebar references still pointed to `/keluar` instead of a single canonical `/logout`.

## Cleanup Recommendation

1. Keep route aliases during transition to avoid breaking existing links.
2. Preserve `PlaceholderPage.jsx` and `CyberVaultLayout.jsx` until a later cleanup phase confirms no external usage.
3. Use `VITE_ROUTER_BASENAME` when deploying under a known subfolder; fallback auto-detection covers local `/dist` usage.
