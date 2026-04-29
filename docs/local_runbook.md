# SolarHub Local Runbook

This runs the platform locally now, with mock providers. When real keys arrive, fill the same `.env` files and the app will start reporting those providers as live-ready.

## 1. Local Environment

Create these files from examples:

```powershell
Copy-Item .env.example .env
Copy-Item apps/backend/.env.example apps/backend/.env
Copy-Item apps/web-admin/.env.example apps/web-admin/.env
Copy-Item apps/mobile/.env.example apps/mobile/.env
```

Keep local mode:

```env
USE_MOCK=true
VITE_API_URL=http://localhost:5000
EXPO_PUBLIC_API_URL=http://localhost:5000
```

## 2. Start Local Backend

```powershell
$env:USE_MOCK='true'
npm run dev:backend
```

Backend URL:

```text
http://localhost:5000
```

Health:

```text
http://localhost:5000/api/health
```

Provider readiness:

```text
http://localhost:5000/api/provider-integrations
```

## 3. Start Local Web / Chrome Install App

In a second terminal:

```powershell
npm run dev:web
```

Open:

```text
http://localhost:5173
```

Chrome install works on localhost. In production it requires HTTPS.

## 4. Start Mobile Locally

In a third terminal:

```powershell
npm run dev:mobile
```

For Android Studio emulator:

```powershell
cd apps/mobile
npm run android
```

For vendor variant config check:

```powershell
cd apps/mobile
$env:APP_VARIANT='vendor'
npx expo config --json
```

## 5. Test Login Roles

Use OTP `1234`.

- Customer: any normal 10-digit number
- Partner: `9999999991`
- Technician: `9999999992`
- Vendor: `9999999993`
- Admin: `9999999994`
- CA / Compliance partner: `9999999995`

## 6. When Keys Arrive

Fill these values in `.env` and `apps/backend/.env`:

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMS_PROVIDER_KEY=
WHATSAPP_PROVIDER_TOKEN=
MAPS_API_KEY=
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
DELHIVERY_API_KEY=
STORAGE_BUCKET=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Then set:

```env
USE_MOCK=false
```

Check:

```text
http://localhost:5000/api/provider-integrations
```

Anything with configured keys should show `live_ready`.

## 7. Local APK / Play Store Builds

Vendor APK:

```powershell
npm run build:vendor:apk
```

Vendor Play Store AAB:

```powershell
npm run build:vendor:aab
```

Customer APK:

```powershell
npm run build:apk
```

Customer Play Store AAB:

```powershell
npm run build:aab -w mobile
```
