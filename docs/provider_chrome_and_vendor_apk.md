# Provider Chrome Install + Vendor APK Launch

This setup gives SolarHub two provider launch paths:

- Chrome installable Provider Console for vendors, technicians, partners, and admins.
- Native Android vendor app builds for APK sharing and Play Store AAB submission.

## 1. Chrome Installable Provider App

The web app is now PWA-ready:

- Manifest: `apps/web-admin/public/manifest.webmanifest`
- Service worker: `apps/web-admin/public/sw.js`
- Install prompt button: `apps/web-admin/src/components/PwaInstallButton.jsx`

Build and host:

```bash
npm run build:web
```

Deploy `apps/web-admin/dist` to HTTPS hosting. Chrome will show the install option only on HTTPS or localhost.

Provider shortcuts are configured for:

- Vendor Dashboard
- Technician Jobs
- Partner Leads

## 2. Vendor Android APK

Vendor app builds use the same Expo codebase with a vendor variant:

- App name: `SolarHub Vendor`
- Android package: `in.solarhub.vendor`
- URL scheme: `solarhub-vendor`
- EAS profile: `vendor-apk`

Build vendor APK for direct sharing/internal testing:

```bash
npm run build:vendor:apk
```

Build vendor AAB for Play Store:

```bash
npm run build:vendor:aab
```

Customer app builds remain:

```bash
npm run build:apk
npm run build:aab -w mobile
```

## 3. Android Studio Local Work

Use Android Studio when you need native debugging, emulator testing, signing checks, or Play Store pre-launch fixes.

From `apps/mobile`:

```bash
npx expo prebuild --platform android
npx expo run:android
```

For vendor variant in PowerShell:

```powershell
$env:APP_VARIANT='vendor'
npx expo prebuild --platform android
npx expo run:android
```

Then open `apps/mobile/android` in Android Studio.

## 4. Play Store Launch

Use AAB for Play Store:

```bash
npm run build:vendor:aab
```

Required before submission:

- Replace `extra.eas.projectId` in `apps/mobile/app.json`.
- Connect EAS credentials.
- Create the Play Console app for package `in.solarhub.vendor`.
- Add store listing, screenshots, privacy policy, data safety, and app access notes.
- Upload the AAB to internal testing first.

## 5. Role Strategy

Use one backend with role-based access:

- Customer app: `in.solarhub.app`
- Vendor app: `in.solarhub.vendor`
- Chrome Provider Console: vendors, technicians, partners, and admins

Services stay operational. Ecommerce checkout remains the revenue path.
