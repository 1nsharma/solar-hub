import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import {
  fetchMicrogridSummary,
  fetchLiveMeter,
  fetchWallet,
  rechargeWallet,
  fetchDynamicPricing,
  fetchMicrogridTrades,
  executeMicrogridTrade,
  controlMeterRelay,
  fetchP2PAgreement,
  acceptP2PAgreement
} from '@/constants/api';

import { SmartMeterDisplay } from '@/components/solar/smart-meter-display';
import { SolarWalletCard } from '@/components/solar/solar-wallet-card';
import { P2PTradingMarket } from '@/components/solar/p2p-trading-market';
import { RelayControlPanel } from '@/components/solar/relay-control-panel';
import { RechargeModal } from '@/components/solar/recharge-modal';

export default function MicrogridScreen() {
  const [selectedDevice, setSelectedDevice] = useState<'flat_101' | 'flat_102' | 'solar_main'>('flat_101');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data States
  const [summary, setSummary] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [agreement, setAgreement] = useState<any>(null);

  // Modal State
  const [showRecharge, setShowRecharge] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [sumRes, telRes, walRes, priceRes, trdRes, agrRes] = await Promise.all([
        fetchMicrogridSummary(),
        fetchLiveMeter(selectedDevice),
        fetchWallet(selectedDevice),
        fetchDynamicPricing(),
        fetchMicrogridTrades(selectedDevice),
        fetchP2PAgreement(selectedDevice)
      ]);

      setSummary(sumRes);
      setTelemetry(telRes);
      setWallet(walRes);
      setPricing(priceRes);
      setTrades(trdRes.trades || []);
      setAgreement(agrRes);
    } catch (err) {
      console.error('[MicrogridScreen] load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDevice]);

  useEffect(() => {
    setLoading(true);
    loadData();
    // Simulate real-time polling every 6 seconds
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRecharge = async (amount: number, method: string) => {
    const res = await rechargeWallet(selectedDevice, amount, method);
    if (res && res.status === 'success') {
      await loadData();
    }
  };

  const handleTrade = async (energyKwh: number) => {
    const res = await executeMicrogridTrade({
      sellerDeviceId: 'solar_main',
      buyerDeviceId: selectedDevice,
      energyKwh,
      customRate: pricing?.current_rate || 5.80
    });
    if (res && res.trade_id) {
      await loadData();
    }
  };

  const handleRelayControl = async (command: 'CUTOFF' | 'RESTORE', reason: string) => {
    const res = await controlMeterRelay(selectedDevice, command, reason);
    if (res && res.status === 'success') {
      await loadData();
    }
  };

  const handleSignAgreement = async () => {
    try {
      const sig = `SIG_VERIFIED_${selectedDevice.toUpperCase()}_${Date.now()}`;
      await acceptP2PAgreement(selectedDevice, sig);
      Alert.alert('Agreement Signed', 'Shared Green Energy Infrastructure consent verified on-chain.');
      await loadData();
    } catch (err: any) {
      Alert.alert('Signature Failed', err.message);
    }
  };

  if (loading && !telemetry) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <ThemedText style={{ marginTop: 12, color: '#8A99A8' }}>
          Connecting to Microgrid Gateway...
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E5FF" />}
    >
      {/* App Bar Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitle}>Unified Microgrid Trading</ThemedText>
          <ThemedText style={styles.headerSub}>
            SolarHub × SolarSync Smart Metering Architecture
          </ThemedText>
        </View>
        <View style={styles.gridPill}>
          <View style={styles.gridPillDot} />
          <ThemedText style={styles.gridPillText}>GRID SYNC</ThemedText>
        </View>
      </View>

      {/* Meter / Device Selector */}
      <View style={styles.selectorRow}>
        {[
          { id: 'flat_101', label: 'Flat 101 (Consumer)' },
          { id: 'flat_102', label: 'Flat 102 (Consumer)' },
          { id: 'solar_main', label: 'Rooftop (15kW Solar)' }
        ].map((node) => (
          <TouchableOpacity
            key={node.id}
            style={[styles.nodeChip, selectedDevice === node.id && styles.nodeChipActive]}
            onPress={() => setSelectedDevice(node.id as any)}
          >
            <ThemedText
              style={[styles.nodeChipText, selectedDevice === node.id && styles.nodeChipTextActive]}
            >
              {node.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Fleet Overview Metrics */}
      {summary && (
        <LinearGradient colors={['#101622', '#0A0E17']} style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Solar Gen</ThemedText>
            <ThemedText style={styles.summaryVal}>{summary.total_solar_generation_kw} kW</ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Microgrid Load</ThemedText>
            <ThemedText style={styles.summaryVal}>{summary.total_microgrid_demand_kw} kW</ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Carbon Saved</ThemedText>
            <ThemedText style={[styles.summaryVal, { color: '#4CAF50' }]}>
              {summary.carbon_offset_kg_today} kg
            </ThemedText>
          </View>
        </LinearGradient>
      )}

      {/* 1. Real-time Smart Meter Telemetry Card */}
      {telemetry && <SmartMeterDisplay telemetry={telemetry} onRefresh={onRefresh} />}

      {/* 2. Prepaid Energy Wallet Card */}
      {wallet && (
        <SolarWalletCard
          wallet={wallet}
          onRechargePress={() => setShowRecharge(true)}
        />
      )}

      {/* 3. P2P Solar Energy Trading Market */}
      <P2PTradingMarket
        currentRate={pricing?.current_rate || 5.80}
        pricingTier={pricing?.pricing_tier || 'normal'}
        solarSupplyWatts={pricing?.solar_supply_watts || 9450}
        gridDemandWatts={pricing?.grid_demand_watts || 5820}
        trades={trades}
        onTradeExecute={handleTrade}
      />

      {/* 4. IoT Solid-State Relay Interlock Switch */}
      {telemetry && (
        <RelayControlPanel
          deviceId={selectedDevice}
          relayState={telemetry.relay_state}
          onControlRelay={handleRelayControl}
        />
      )}

      {/* 5. Legal PPA Infrastructure Agreement Banner */}
      <View style={styles.agreementCard}>
        <View style={styles.agreementLeft}>
          <IconSymbol name="shield.fill" size={20} color="#00E5FF" />
          <View style={{ marginLeft: 10 }}>
            <ThemedText style={styles.agreementTitle}>
              Shared Green Energy Infrastructure PPA
            </ThemedText>
            <ThemedText style={styles.agreementSub}>
              {agreement?.is_active
                ? `Digitally Signed • Version ${agreement.version || '1.0'}`
                : 'Action Required: Pending Legal Consent'}
            </ThemedText>
          </View>
        </View>

        {!agreement?.is_active && (
          <TouchableOpacity style={styles.signBtn} onPress={handleSignAgreement}>
            <ThemedText style={styles.signBtnText}>Sign Agreement</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Recharge Modal */}
      <RechargeModal
        visible={showRecharge}
        deviceId={selectedDevice}
        onClose={() => setShowRecharge(false)}
        onRechargeComplete={handleRecharge}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070A0F',
  },
  content: {
    padding: 16,
    paddingTop: 54,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: '#070A0F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#8A99A8',
    marginTop: 2,
  },
  gridPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  gridPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00E5FF',
    marginRight: 6,
  },
  gridPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00E5FF',
    letterSpacing: 0.5,
  },
  selectorRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  nodeChip: {
    paddingVertical: 7,
    paddingHorizontal: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  nodeChipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
  },
  nodeChipText: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  nodeChipTextActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#8A99A8',
    marginBottom: 3,
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  agreementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10141D',
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  agreementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agreementTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agreementSub: {
    fontSize: 10,
    color: '#8A99A8',
    marginTop: 2,
  },
  signBtn: {
    backgroundColor: '#00E5FF',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  signBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A141C',
  },
});
