# Unified Microgrid Solar Trading Architecture
**SolarHub × SolarSync (solar_wallet) Interconnection Specification**
*Author: Stanley (CleanTech Lead) — Division 04 CleanTech & Solar Energy*

---

## 1. Executive Summary

This specification establishes a **Unified Microgrid Solar Trading Architecture** integrating the **SolarHub Expo client** (`solar-hub/apps/mobile`), **SolarHub Commerce & Fulfillment Platform** (`solar-hub/apps/backend`), and the **SolarSync IoT Smart Metering Database & Engine** (`solar_wallet/database` & `solar_wallet/backend`).

The unified platform empowers residential societies, commercial parks, and rural solar clusters to:
1. **Monitor Real-Time IoT Smart Metering Telemetry**: Voltage (V), Current (A), Active Power (W/kW), Grid Frequency (50 Hz nominal), Power Factor, and Solid-State Relay Interlock states.
2. **Operate a Prepaid Solar Energy Wallet**: Real-time balance deduction based on live power readings, automatic safety cutoff when balance reaches zero, and instantaneous relay restoration upon UPI/Card recharge.
3. **Engage in P2P Solar Energy Trading**: Peer-to-peer energy matching allowing rooftop prosumers (`solar_main` 15kW array) to wheel surplus solar generation directly to neighbours (`flat_101`, `flat_102`, `flat_201`) at dynamic rates below utility peak tariffs.
4. **Deploy Dynamic Tariffs**: Automated supply-demand pricing with morning solar ramp incentives (0.92x), afternoon peak generation discounts (0.85x), and evening grid peak load multipliers (1.25x), bounded within statutory limits (₹4.50 – ₹10.50/kWh).
5. **Execute Legally Compliant PPA Contracts**: Embedded digital signature workflow for Shared Green Energy Infrastructure Agreements.

---

## 2. System Architecture Diagram

```
                     ┌──────────────────────────────────────────────┐
                     │          SolarHub Expo Client (Mobile)       │
                     │  - SmartMeterDisplay (Live Telemetry)        │
                     │  - SolarWalletCard (Prepaid Balance & Escrow)│
                     │  - P2PTradingMarket (Peer Energy Orders)     │
                     │  - RelayControlPanel (Safety Interlock)      │
                     │  - RechargeModal (UPI / Cards / Auto-Sweep)  │
                     └──────────────────────┬───────────────────────┘
                                            │ HTTP / WebSocket
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │       SolarHub Backend API (Port 5001)       │
                     │  - /api/microgrid/summary                    │
                     │  - /api/microgrid/telemetry/:deviceId        │
                     │  - /api/microgrid/wallet/:deviceId           │
                     │  - /api/microgrid/wallet/recharge            │
                     │  - /api/microgrid/pricing/current            │
                     │  - /api/microgrid/trades/execute             │
                     │  - /api/microgrid/relay/control              │
                     │  - /api/microgrid/agreement/accept           │
                     └───────┬───────────────────────────────┬──────┘
                             │                               │
             MQTT Broker     │                               │ PostgreSQL Database
             solarsync/+/data│                               │ (Unified Schema)
                             ▼                               ▼
       ┌─────────────────────────────┐        ┌─────────────────────────────┐
       │     IoT Hardware Layer      │        │    Relational & Timeseries  │
       │ - ESP32 Smart Energy Meter  │        │ - meter_devices             │
       │ - PZEM-004T AC Sensor       │        │ - meter_telemetry           │
       │ - Solid-State Cutoff Relay  │        │ - energy_wallets            │
       │ - Rooftop Solar Inverters   │        │ - microgrid_trades          │
       │   (15kW Rooftop Array)      │        │ - dynamic_pricing_log       │
       └─────────────────────────────┘        │ - p2p_agreements            │
                                              │ - microgrid_events          │
                                              └─────────────────────────────┘
```

---

## 3. Database Schema & Interconnection

The relational database (`solar-hub/db/schema.sql`) incorporates the core tables from `solar_wallet/database/schema.sql` into the production SolarHub schema:

### 3.1 `meter_devices`
| Field | Type | Description |
|---|---|---|
| `device_id` | `VARCHAR(50) PRIMARY KEY` | Device identifier (e.g. `flat_101`, `solar_main`) |
| `user_id` | `UUID REFERENCES users(id)` | Associated platform user |
| `device_type` | `VARCHAR(50)` | `smart_meter`, `solar_inverter`, `relay_module` |
| `location` | `VARCHAR(255)` | Installation location |
| `role` | `VARCHAR(20)` | `provider`, `consumer`, `prosumer` |
| `relay_state` | `BOOLEAN` | `true` (energized/closed), `false` (cutoff/open) |
| `device_status` | `VARCHAR(20)` | `online`, `offline`, `cutoff`, `error` |
| `firmware_version` | `VARCHAR(20)` | e.g. `v1.4.2-esp32` |
| `wifi_rssi` | `INTEGER` | Signal strength in dBm |

### 3.2 `meter_telemetry`
Stores 5-second interval electrical measurements:
- `voltage` (nominal 230V AC)
- `current` (Amperes)
- `power_watts` (Real-time active load)
- `energy_kwh` (Accumulated meter index)
- `frequency` (50.0 Hz nominal)
- `power_factor` (0.00 – 1.00)
- `solar_generation_watts` (Rooftop inverter output)

### 3.3 `energy_wallets`
- `balance`: Real-time prepaid balance in INR (auto-deducted every interval).
- `security_deposit`: Standard ₹2,000 escrow protection.
- `auto_cutoff_threshold`: Threshold at which disconnect command triggers (₹0.00).
- `is_cutoff_active`: Boolean flag indicating supply cutoff.

### 3.4 `microgrid_trades`
Peer-to-peer contract ledger recording direct prosumer-to-consumer trades:
- `seller_device_id` & `buyer_device_id`
- `energy_kwh`: Transferred clean energy units
- `rate_per_kwh`: Contract rate (INR)
- `total_amount`: Total financial settlement
- `status`: `settled`, `matched`, `disputed`

---

## 4. Dynamic Pricing Engine

The dynamic tariff engine (`@solar-hub/shared/microgrid.js`) balances supply and demand automatically:

$$\text{Supply-Demand Ratio} = \frac{\text{Solar Generation (Watts)}}{\max(\text{Total Demand (Watts)}, 1)}$$

1. **Excess Clean Supply ($\ge 1.5$)**: Base rate drops to **₹4.90/kWh** to encourage local appliance usage and battery storage charging.
2. **Balanced Generation ($1.0 - 1.49$)**: Base rate adjusts to **₹5.50/kWh**.
3. **Moderate Demand ($0.5 - 0.99$)**: Base rate normalizes at **₹6.50 – ₹8.10/kWh**.
4. **Peak Grid Deficit ($< 0.5$)**: Base rate reaches ceiling at **₹10.50/kWh**.

### Time-of-Day Multipliers:
- **Morning Solar Ramp (06:00 – 10:00)**: $0.92\times$
- **Peak Solar Generation (11:00 – 15:00)**: $0.85\times$
- **Evening Peak Grid Load (18:00 – 22:00)**: $1.25\times$

---

## 5. Automated Safety Cutoff & Restoration Workflow

1. **Interval Telemetry Stream**: The IoT ESP32 pushes sensor readings every 5 seconds to `/api/microgrid/telemetry/:deviceId`.
2. **Cost Computation**: Cost is calculated as:
   $$\text{Cost} = \left(\frac{\text{Power (Watts)}}{1000}\right) \times \left(\frac{\Delta t}{3600}\right) \times \text{Current Rate (₹/kWh)}$$
3. **Wallet Balance Deduction**: The user's prepaid wallet is decremented.
4. **Auto-Cutoff Trigger**: When the balance reaches ₹0.00:
   - `relay_state` is set to `false`.
   - `device_status` transitions to `'cutoff'`.
   - Hardware `CUTOFF` packet is dispatched via MQTT topic `solarsync/:deviceId/command`.
   - Microgrid event is logged with audit metadata.
5. **Auto-Restoration on Recharge**:
   - The user opens the **Recharge Modal** in the SolarHub mobile app.
   - User recharges ₹200, ₹500, ₹1,000, or custom amount via UPI/Card.
   - Upon successful payment verification, the system detects positive balance, flips `relay_state` to `true`, and dispatches hardware `RESTORE` packet to re-energize the line instantly.

---

## 6. Verification & Test Evidence

All 9 end-to-end integration tests pass with 100% success rate:
- `[Test 1] Dynamic Pricing Engine`: Verified rate bounding [₹4.50 – ₹10.50] and tier categorization.
- `[Test 2] Microgrid Fleet Summary`: Verified fleet metrics, solar generation kW, and carbon offset kg calculations.
- `[Test 3] Live Smart Meter Telemetry`: Verified nominal grid telemetry (230V, 50Hz, power factor, burn rate).
- `[Test 4] Prepaid Energy Wallet`: Verified real-time balance deductions based on power consumption.
- `[Test 5] Wallet Recharge & Auto-Restore`: Verified balance credit and automatic relay reconnection.
- `[Test 6] Automated Safety Cutoff`: Verified relay opens when balance hits ₹0.00.
- `[Test 7] P2P Solar Energy Trading`: Verified atomic settlement between prosumer rooftop array and consumer flat.
- `[Test 8] Remote Relay Control`: Verified manual CUTOFF & RESTORE commands with audit trail.
- `[Test 9] Legal PPA Agreement Execution`: Verified digital signature verification and on-chain record.

---

## 7. Client UI Screen Summary

The SolarHub Expo app (`solar-hub/apps/mobile`) includes a dedicated **Microgrid** tab with:
- **Real-Time Telemetry Card (`SmartMeterDisplay`)**: Live voltage, current, active power, grid frequency, power factor, and relay status.
- **Prepaid Energy Wallet Card (`SolarWalletCard`)**: Balance, remaining power runtime estimate, security escrow deposit, and low-balance warnings.
- **P2P Solar Trading Market (`P2PTradingMarket`)**: Dynamic tariff badge, microgrid energy balance visual bar, instant kWh purchase input with quick chips, and live peer settlements ledger.
- **Relay Safety Interlock Panel (`RelayControlPanel`)**: Emergency cutoff switch with confirmation dialog.
- **Quick Recharge Modal (`RechargeModal`)**: Fast UPI/Card payment with preset amounts and auto-restore.
- **Legal Infrastructure Agreement Banner**: Status of digital PPA agreement.
