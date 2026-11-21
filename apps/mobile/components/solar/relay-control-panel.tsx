import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface RelayControlProps {
  deviceId: string;
  relayState: boolean;
  onControlRelay: (command: 'CUTOFF' | 'RESTORE', reason: string) => Promise<void>;
}

export function RelayControlPanel({ deviceId, relayState, onControlRelay }: RelayControlProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    const nextCommand = relayState ? 'CUTOFF' : 'RESTORE';
    const actionLabel = relayState ? 'Disconnect (Cut Off)' : 'Reconnect (Restore)';

    Alert.alert(
      `Confirm Relay ${actionLabel}`,
      `Are you sure you want to send a hardware ${nextCommand} command to ${deviceId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionLabel,
          style: relayState ? 'destructive' : 'default',
          onPress: async () => {
            setLoading(true);
            try {
              await onControlRelay(nextCommand, 'Manual user trigger from SolarHub Expo');
            } catch (err: any) {
              Alert.alert('Command Failed', err.message || 'Relay control error.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.iconBox, { backgroundColor: relayState ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 82, 82, 0.15)' }]}>
            <IconSymbol name="power" size={22} color={relayState ? '#4CAF50' : '#FF5252'} />
          </View>
          <View style={styles.textGroup}>
            <ThemedText style={styles.title}>IoT Solid-State Relay Interlock</ThemedText>
            <ThemedText style={styles.subtitle}>
              {relayState
                ? 'Supply line closed & energized'
                : 'Supply line opened (Manual Disconnect)'}
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.switchBtn, { backgroundColor: relayState ? '#FF5252' : '#4CAF50' }]}
          onPress={handleToggle}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <ThemedText style={styles.switchBtnText}>
              {relayState ? 'Cut Off' : 'Restore'}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161922',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#8A99A8',
    marginTop: 2,
  },
  switchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
