import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

interface P2PTradingProps {
  currentRate: number;
  pricingTier?: string;
  solarSupplyWatts?: number;
  gridDemandWatts?: number;
  trades: Array<{
    trade_id: string;
    seller_name?: string;
    buyer_name?: string;
    energy_kwh: number;
    rate_per_kwh: number;
    total_amount: number;
    settled_at: string;
  }>;
  onTradeExecute: (energyKwh: number) => Promise<void>;
}

export function P2PTradingMarket({
  currentRate,
  pricingTier = 'normal',
  solarSupplyWatts = 9450,
  gridDemandWatts = 5820,
  trades,
  onTradeExecute
}: P2PTradingProps) {
  const [units, setUnits] = useState('5.0');
  const [submitting, setSubmitting] = useState(false);

  const numUnits = parseFloat(units) || 0;
  const estimatedCost = (numUnits * currentRate).toFixed(2);

  const handleBuy = async () => {
    if (numUnits <= 0) {
      Alert.alert('Invalid Units', 'Please enter a valid amount of kWh to trade.');
      return;
    }
    setSubmitting(true);
    try {
      await onTradeExecute(numUnits);
      Alert.alert('Trade Executed', `Successfully purchased ${numUnits} kWh clean solar power!`);
    } catch (err: any) {
      Alert.alert('Trade Error', err.message || 'Failed to settle P2P energy trade.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#171B26', '#0E1118']} style={styles.card}>
        {/* Dynamic Pricing Engine Header */}
        <View style={styles.headerRow}>
          <View>
            <ThemedText style={styles.marketTitle}>P2P Solar Trading Market</ThemedText>
            <ThemedText style={styles.marketSub}>
              Microgrid Peer-to-Peer Energy Wheeling
            </ThemedText>
          </View>
          <View style={styles.rateBadge}>
            <ThemedText style={styles.rateNumber}>₹{currentRate.toFixed(2)}</ThemedText>
            <ThemedText style={styles.rateUnit}>/kWh</ThemedText>
          </View>
        </View>

        {/* Microgrid Supply / Demand Balance Bar */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceHeader}>
            <ThemedText style={styles.balanceLabel}>Microgrid Energy Balance</ThemedText>
            <ThemedText style={styles.tierName}>{pricingTier.toUpperCase()}</ThemedText>
          </View>
          <View style={styles.balanceBarBg}>
            <View
              style={[
                styles.balanceBarFill,
                { width: `${Math.min(100, Math.round((solarSupplyWatts / Math.max(gridDemandWatts, 1)) * 50))}%` }
              ]}
            />
          </View>
          <View style={styles.balanceStats}>
            <ThemedText style={styles.statText}>Solar: {(solarSupplyWatts / 1000).toFixed(1)} kW</ThemedText>
            <ThemedText style={styles.statText}>Demand: {(gridDemandWatts / 1000).toFixed(1)} kW</ThemedText>
          </View>
        </View>

        {/* Trade Order Entry */}
        <View style={styles.tradeInputCard}>
          <ThemedText style={styles.inputTitle}>Instant P2P Clean Energy Purchase</ThemedText>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <ThemedText style={styles.inputLabel}>Units (kWh)</ThemedText>
              <TextInput
                value={units}
                onChangeText={setUnits}
                keyboardType="decimal-pad"
                style={styles.textInput}
                placeholder="5.0"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.costBox}>
              <ThemedText style={styles.inputLabel}>Total Payable</ThemedText>
              <ThemedText style={styles.costValue}>₹{estimatedCost}</ThemedText>
            </View>
          </View>

          {/* Quick preset chips */}
          <View style={styles.chipsRow}>
            {['2.0', '5.0', '10.0', '25.0'].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[styles.chip, units === preset && styles.chipActive]}
                onPress={() => setUnits(preset)}
              >
                <ThemedText style={[styles.chipText, units === preset && styles.chipTextActive]}>
                  {preset} kWh
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.tradeBtn, submitting && styles.tradeBtnDisabled]}
            onPress={handleBuy}
            disabled={submitting}
          >
            <LinearGradient
              colors={['#00E5FF', '#0091EA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tradeBtnGrad}
            >
              {submitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <ThemedText style={styles.tradeBtnText}>⚡ Buy Microgrid Solar Power</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Live Trades Settlement Feed */}
        <View style={styles.settlementsSection}>
          <ThemedText style={styles.sectionTitle}>Recent Peer Settlements</ThemedText>
          {trades.slice(0, 3).map((item) => (
            <View key={item.trade_id} style={styles.tradeItem}>
              <View>
                <ThemedText style={styles.tradeParties}>
                  {item.seller_name || 'Rooftop Array'} ➔ {item.buyer_name || 'You'}
                </ThemedText>
                <ThemedText style={styles.tradeSub}>
                  {item.energy_kwh} kWh @ ₹{item.rate_per_kwh.toFixed(2)}/kWh
                </ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText style={styles.tradeAmount}>₹{item.total_amount.toFixed(2)}</ThemedText>
                <ThemedText style={styles.settledBadge}>SETTLED</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  marketSub: {
    fontSize: 11,
    color: '#8A99A8',
    marginTop: 2,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  rateNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#00E5FF',
  },
  rateUnit: {
    fontSize: 12,
    color: '#8A99A8',
    marginLeft: 2,
  },
  balanceContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  tierName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
  },
  balanceBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  balanceBarFill: {
    height: '100%',
    backgroundColor: '#00E5FF',
    borderRadius: 3,
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 10,
    color: '#8A99A8',
  },
  tradeInputCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inputBox: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: '#8A99A8',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  costBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  costValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFB800',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chipActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
  },
  chipText: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  chipTextActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  tradeBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  tradeBtnDisabled: {
    opacity: 0.6,
  },
  tradeBtnGrad: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tradeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A141C',
  },
  settlementsSection: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A0A0A0',
    marginBottom: 10,
  },
  tradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  tradeParties: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tradeSub: {
    fontSize: 10,
    color: '#8A99A8',
    marginTop: 2,
  },
  tradeAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00E5FF',
  },
  settledBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4CAF50',
    marginTop: 2,
  },
});
