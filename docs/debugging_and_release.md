# Debugging and Release

## Local Debugging

VS Code configs are included:

- Backend API
- Web Admin
- Mobile Expo

Open the Run and Debug panel and choose the target. The backend debug profile runs with `USE_MOCK=true`.

Useful checks:

```powershell
npm.cmd run release:check
npm.cmd run smoke -w @solar-hub/backend
```

## Local Runtime URLs

- Web: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Expo Metro: `http://localhost:8081`
- Provider status: `http://localhost:5000/api/provider-integrations`

## APK Release on GitHub

Use the manual workflow:

```text
GitHub > Actions > Android APK Build > Run workflow
```

Choose:

- `vendor` for `SolarHub Vendor`
- `customer` for customer app

To create a GitHub Release, provide a tag like:

```text
v1.0.0-vendor-apk
```

The workflow builds with open-source Android/Gradle tooling and uploads:

```text
solarhub-vendor.apk
```

## Play Store

Use AAB for Play Store:

```powershell
npm run build:vendor:aab
```

For now, GitHub APK workflow is the fastest release path for testing and sharing.
