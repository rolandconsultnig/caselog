# Restore Point A11

**Date Created**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## Description
Backup point before implementing case form updates:
- Form of SGBV options updates
- Case Number to File Number change
- Legal Service Type to Services Required
- Marital Status to Status with new options
- Additional fields and sections

## Files Backed Up
- `app/dashboard/cases/new/page.tsx` → `app/dashboard/cases/new/page.tsx.A11`

## To Restore
```powershell
copy app\dashboard\cases\new\page.tsx.A11 app\dashboard\cases\new\page.tsx
```

