import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

interface RechargeModalProps {
  visible: boolean;
  deviceId: string;
  onClose: () => void;
  onRechargeComplete: (amount: number, method: string) => Promise<void>;
}

export function RechargeModal({ visible, deviceId, onClose, onRechargeComplete }: RechargeModalProps) {
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  const handlePay = async () => {
    if (numAmount < 50) {
      Alert.alert('Minimum Recharge', 'Minimum prepaid recharge amount is ₹50.');
      return;
    }
    setLoading(true);
    try {
      await onRechargeComplete(numAmount, method);
      Alert.alert('Recharge Successful', `₹${numAmount} credited to ${deviceId}. Supply status verified.`);
      onClose();
    } catch (err: any) {
      Alert.alert('Recharge Error', err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.title}>Recharge Energy Wallet</ThemedText>
              <ThemedText style={styles.sub}>Instant balance credit for Smart Meter {deviceId}</ThemedText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <ThemedText style={styles.closeText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Amount input */}
          <View style={styles.amountContainer}>
            <ThemedText style={styles.currency}>₹</ThemedText>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="500"
              placeholderTextColor="#666"
            />
          </View>

          {/* Quick preset chips */}
          <View style={styles.presetsRow}>
            {['200', '500', '1000', '2000'].map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[styles.presetChip, amount === preset && styles.presetChipActive]}
                onPress={() => setAmount(preset)}
              >
                <ThemedText style={[styles.presetText, amount === preset && styles.presetTextActive]}>
                  +₹{preset}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Method Selector */}
          <ThemedText style={styles.sectionHeader}>Select Payment Gateway</ThemedText>
          <View style={styles.methodsRow}>
            <TouchableOpacity
              style={[styles.methodCard, method === 'upi' && styles.methodCardActive]}
              onPress={() => setMethod('upi')}
            >
              <ThemedText style={[styles.methodTitle, method === 'upi' && styles.methodTitleActive]}>
                UPI / QR
              </ThemedText>
              <ThemedText style={styles.methodSub}>GPay, PhonePe, Paytm</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, method === 'card' && styles.methodCardActive]}
              onPress={() => setMethod('card')}
            >
              <ThemedText style={[styles.methodTitle, method === 'card' && styles.methodTitleActive]}>
                Cards
              </ThemedText>
              <ThemedText style={styles.methodSub}>Credit & Debit</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Pay Button */}
          <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
            <LinearGradient
              colors={['#4CAF50', '#2E7D32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.payBtnGrad}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <ThemedText style={styles.payBtnText}>Pay ₹{numAmount} & Restore Supply</ThemedText>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#141822',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sub: {
    fontSize: 12,
    color: '#8A99A8',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#A0A0A0',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  currency: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginRight: 6,
  },
  amountInput: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    minWidth: 120,
    textAlign: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  presetChip: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetChipActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A0A0A0',
  },
  presetTextActive: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A99A8',
    marginBottom: 10,
  },
  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  methodCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  methodCardActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 2,
  },
  methodTitleActive: {
    color: '#00E5FF',
  },
  methodSub: {
    fontSize: 10,
    color: '#8A99A8',
  },
  payBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payBtnGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
