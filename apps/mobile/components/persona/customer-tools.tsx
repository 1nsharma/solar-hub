import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export function CustomerTools() {
  return (
    <View style={styles.container}>
      {/* Live Savings Monitor */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Solar Generation (Live)</ThemedText>
      <View style={styles.chartBox}>
        <LinearGradient 
          colors={['rgba(255,215,0,0.1)', 'transparent']} 
          style={styles.chartBg}
        >
          {/* Animated Chart Visualization */}
          <View style={styles.chartBars}>
            {[40, 60, 45, 80, 95, 70, 50].map((h, i) => (
              <AnimatedBar key={i} height={h} index={i} active={i === 4} />
            ))}
          </View>
        </LinearGradient>
        <View style={styles.chartInfo}>
          <View>
            <ThemedText style={styles.chartValue}>4.2 kWh</ThemedText>
            <ThemedText style={styles.chartLabel}>Current Gen</ThemedText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <ThemedText style={[styles.chartValue, { color: '#4CAF50' }]}>₹1,240</ThemedText>
            <ThemedText style={styles.chartLabel}>Saved this mo</ThemedText>
          </View>
        </View>
      </View>

      {/* Doc Vault */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Document Vault</ThemedText>
      <View style={styles.vaultGrid}>
        <VaultItem title="Warranty" type="PDF" icon="doc.text.fill" />
        <VaultItem title="Subsidy Cert" type="IMAGE" icon="checkmark.seal.fill" />
        <VaultItem title="Installation" type="PDF" icon="camera.fill" />
      </View>

      {/* Service & Maintenance */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Maintenance</ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.actionText}>BOOK CLEANING</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.serviceCard}>
        <View style={styles.serviceIcon}>
          <IconSymbol name="sparkles" size={20} color="#FFD700" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.serviceTitle}>Next Panel Cleaning</ThemedText>
          <ThemedText style={styles.serviceDate}>Scheduled: 15 May, 2026</ThemedText>
        </View>
        <IconSymbol name="calendar" size={20} color="#888" />
      </View>
    </View>
  );
}

function AnimatedBar({ height, index, active }: any) {
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withDelay(index * 100, withSpring(height));
  }, [height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: active ? 1 : 0.5,
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}

function VaultItem({ title, type, icon }: any) {
  return (
    <TouchableOpacity style={styles.vaultItem}>
      <View style={styles.vaultIcon}>
        <IconSymbol name={icon} size={24} color="#FFD700" />
      </View>
      <ThemedText style={styles.vaultTitle}>{title}</ThemedText>
      <ThemedText style={styles.vaultType}>{type}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
  },
  chartBox: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  chartBg: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 16,
    borderRadius: 16,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    gap: 8,
  },
  bar: {
    width: 20,
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  chartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  chartLabel: {
    fontSize: 11,
    opacity: 0.5,
  },
  vaultGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  vaultItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  vaultIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  vaultTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  vaultType: {
    fontSize: 9,
    opacity: 0.4,
    marginTop: 4,
    fontWeight: '900',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
    borderRadius: 20,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  serviceDate: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  }
});
