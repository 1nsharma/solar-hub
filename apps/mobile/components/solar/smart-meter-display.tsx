import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

interface SmartMeterProps {
  telemetry: {
    device_id: string;
    device_name?: string;
    voltage: number;
    current: number;
    power_watts: number;
    energy_kwh: number;
    frequency: number;
    power_factor: number;
    relay_state: boolean;
    device_status: string;
    current_rate: number;
    burn_rate_inr_per_hour: number;
    solar_generation_watts?: number;
  };
  onRefresh?: () => void;
}

export function SmartMeterDisplay({ telemetry, onRefresh }: SmartMeterProps) {
  const isOnline = telemetry.device_status === 'online';
  const isRelayOn = telemetry.relay_state;
  const isGenerating = (telemetry.solar_generation_watts || 0) > 0;

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={isRelayOn ? ['#1A2430', '#0D141C'] : ['#301515', '#1C0D0D']}
        style={styles.card}
      >
        {/* Header: Device Name & Status */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: isRelayOn ? '#00E5FF' : '#FF5252' }]} />
            <View>
              <ThemedText style={styles.deviceTitle}>
                {telemetry.device_name || telemetry.device_id}
              </ThemedText>
              <ThemedText style={styles.deviceSub}>
                Smart IoT Bi-Directional Meter • 50 Hz Grid Synchronized
              </ThemedText>
            </View>
          </View>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={18} color="#00E5FF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Primary Load Display */}
        <View style={styles.mainMetrics}>
          <View>
            <ThemedText style={styles.metricLabel}>
              {isGenerating ? 'SOLAR GENERATION' : 'ACTIVE LOAD CONSUMPTION'}
            </ThemedText>
            <View style={styles.powerRow}>
              <ThemedText style={styles.powerValue}>
                {telemetry.power_watts >= 1000
                  ? (telemetry.power_watts / 1000).toFixed(2)
                  : telemetry.power_watts}
              </ThemedText>
              <ThemedText style={styles.powerUnit}>
                {telemetry.power_watts >= 1000 ? ' kW' : ' W'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.rateBadge}>
            <ThemedText style={styles.rateBadgeText}>
              ₹{telemetry.burn_rate_inr_per_hour.toFixed(2)}/hr
            </ThemedText>
            <ThemedText style={styles.rateBadgeSub}>Deduction Rate</ThemedText>
          </View>
        </View>

        {/* Electrical Grid Telemetry Grid */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <ThemedText style={styles.gridLabel}>Voltage</ThemedText>
            <ThemedText style={styles.gridValue}>{telemetry.voltage} V</ThemedText>
          </View>

          <View style={styles.gridItem}>
            <ThemedText style={styles.gridLabel}>Current</ThemedText>
            <ThemedText style={styles.gridValue}>{telemetry.current} A</ThemedText>
          </View>

          <View style={styles.gridItem}>
            <ThemedText style={styles.gridLabel}>Frequency</ThemedText>
            <ThemedText style={styles.gridValue}>{telemetry.frequency} Hz</ThemedText>
          </View>

          <View style={styles.gridItem}>
            <ThemedText style={styles.gridLabel}>Power Factor</ThemedText>
            <ThemedText style={styles.gridValue}>{telemetry.power_factor}</ThemedText>
          </View>
        </View>

        {/* Relay Safety State Strip */}
        <View style={[styles.relayStrip, { borderColor: isRelayOn ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 82, 82, 0.3)' }]}>
          <View style={styles.relayLeft}>
            <IconSymbol
              name="power"
              size={18}
              color={isRelayOn ? '#4CAF50' : '#FF5252'}
            />
            <ThemedText style={[styles.relayStatusText, { color: isRelayOn ? '#4CAF50' : '#FF5252' }]}>
              {isRelayOn ? 'Supply Active (Relay Closed)' : 'Supply Cut Off (Relay Tripped)'}
            </ThemedText>
          </View>
          <ThemedText style={styles.totalEnergy}>
            Accum: {telemetry.energy_kwh.toFixed(2)} kWh
          </ThemedText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deviceSub: {
    fontSize: 11,
    color: '#8A99A8',
    marginTop: 2,
  },
  refreshBtn: {
    padding: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 8,
  },
  mainMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#00E5FF',
    marginBottom: 4,
  },
  powerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  powerValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  powerUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00E5FF',
    marginLeft: 4,
  },
  rateBadge: {
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
  },
  rateBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFB800',
  },
  rateBadgeSub: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    alignItems: 'center',
    flex: 1,
  },
  gridLabel: {
    fontSize: 11,
    color: '#8A99A8',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  relayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  relayLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relayStatusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  totalEnergy: {
    fontSize: 12,
    color: '#8A99A8',
  },
});
