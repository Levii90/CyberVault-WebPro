# Backend Auth Database Setup

## Environment

- project path: `D:\xampp\htdocs\CyberVault-v1.0\CyberVault-WebPro`
- mysql cli: `D:\xampp\mysql\bin\mysql.exe`
- expected database: `cybervault_db`

## Commands

Create database:

```powershell
& 'D:\xampp\mysql\bin\mysql.exe' -u root -e "CREATE DATABASE IF NOT EXISTS cybervault_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Run auth schema:

```powershell
& 'D:\xampp\mysql\bin\mysql.exe' -u root cybervault_db < backend/database/schema/auth_schema_v1.sql
```

Verify tables:

```powershell
& 'D:\xampp\mysql\bin\mysql.exe' -u root -D cybervault_db -e "SHOW TABLES;"
```

## Notes

- schema ini tidak melakukan `DROP TABLE`
- password MySQL diasumsikan kosong untuk local XAMPP
- jika kredensial berubah, sesuaikan `backend/application/config/database.php`
