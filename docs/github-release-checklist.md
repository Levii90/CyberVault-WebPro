# GitHub Release Checklist

## Boleh Dipush

- `src/`
- `backend/`
- `docs/`
- `scripts/`
- `public/`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `index.php`
- `.htaccess`
- `.env.example`
- `.env.xampp.example`
- `.env.vercel.example`
- `.env.cyberpanel.example`
- `README.md`
- `README_DEPLOY_CYBERPANEL.md`
- `database/cybervault_schema_for_cyberpanel.sql`

## Tidak Boleh Dipush

- `.env.local`
- `.env.development.local`
- `node_modules/`
- `dist/`
- `release/`
- `framework-sources/`
- `.git/`
- token/session dump
- database dump yang berisi data sensitif

## Command Checklist

```bash
git status
git add .
git commit -m "chore: prepare CyberVault fullstack release candidate"
git push origin main
```

## Reminder

- Pastikan `.env.local` tidak tracked
- Pastikan `.env.development.local` tidak tracked
- Pastikan `framework-sources` tidak tracked
- Pastikan `node_modules` tidak tracked
- Pastikan `dist` dan `release` tidak tracked
- Pastikan tidak ada raw token, password plaintext, atau bearer token di source
