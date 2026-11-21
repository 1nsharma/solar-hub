import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

interface SolarWalletProps {
  wallet: {
    device_id: string;
    balance: number;
    security_deposit: number;
    is_cutoff_active: boolean;
    current_rate: number;
    hourly_cost_estimate: number;
    relay_state?: boolean;
  };
  onRechargePress: () => void;
}

export function SolarWalletCard({ wallet, onRechargePress }: SolarWalletProps) {
  const hoursRemaining =
    wallet.hourly_cost_estimate > 0
      ? (wallet.balance / wallet.hourly_cost_estimate).toFixed(0)
      : '∞';

  const isLowBalance = wallet.balance < 100;
  const isCutoff = wallet.balance <= 0 || wallet.is_cutoff_active;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={isCutoff ? ['#3D1414', '#210B0B'] : ['#14241B', '#0A140F']}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View style={styles.labelGroup}>
            <IconSymbol name="wallet.pass.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.walletTitle}>Solar Energy Prepaid Wallet</ThemedText>
          </View>
          <View style={[styles.tierBadge, { backgroundColor: isCutoff ? '#FF5252' : isLowBalance ? '#FFB800' : '#4CAF50' }]}>
            <ThemedText style={styles.tierText}>
              {isCutoff ? 'CUTOFF ACTIVE' : isLowBalance ? 'LOW BALANCE' : 'FUNDED'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.balanceRow}>
          <View>
            <ThemedText style={styles.currencyPrefix}>₹</ThemedText>
            <ThemedText style={styles.balanceValue}>{wallet.balance.toFixed(2)}</ThemedText>
          </View>
          <TouchableOpacity style={styles.rechargeBtn} onPress={onRechargePress}>
            <LinearGradient
              colors={['#FFD700', '#FFA000']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.rechargeBtnGrad}
            >
              <ThemedText style={styles.rechargeBtnText}>+ Recharge</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Runtime Estimate & Escrow Details */}
        <View style={styles.footerRow}>
          <View style={styles.footerCol}>
            <ThemedText style={styles.footerLabel}>Est. Power Remaining</ThemedText>
            <ThemedText style={styles.footerValue}>{hoursRemaining} Hours</ThemedText>
          </View>
          <View style={[styles.footerCol, { alignItems: 'flex-end' }]}>
            <ThemedText style={styles.footerLabel}>Security Escrow Deposit</ThemedText>
            <ThemedText style={styles.footerValue}>₹{wallet.security_deposit.toFixed(2)}</ThemedText>
          </View>
        </View>

        {isCutoff && (
          <View style={styles.cutoffWarning}>
            <IconSymbol name="shield.fill" size={16} color="#FF5252" />
            <ThemedText style={styles.cutoffWarningText}>
              Prepaid balance exhausted. Recharge immediately to auto-restore power.
            </ThemedText>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E0E0E0',
    marginLeft: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: -4,
  },
  rechargeBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  rechargeBtnGrad: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  rechargeBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#101010',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 11,
    color: '#8A99A8',
    marginBottom: 3,
  },
  footerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cutoffWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  cutoffWarningText: {
    fontSize: 11,
    color: '#FF8A80',
    marginLeft: 8,
    flex: 1,
  },
});
