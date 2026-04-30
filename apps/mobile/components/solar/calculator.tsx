import React, { useState, useMemo } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ROOF_TYPES = ['RCC (Flat)', 'Tile (Sloped)', 'Asbestos/Tin'];

export function SolarCalculator({ onOrder }: { onOrder?: () => void }) {
  const [bill, setBill] = useState('2500');
  const [pincode, setPincode] = useState('');
  const [roofType, setRoofType] = useState('RCC (Flat)');
  const [area, setArea] = useState('300');
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const results = useMemo(() => {
    const b = parseFloat(bill) || 0;
    const a = parseFloat(area) || 0;
    
    const sizeByBill = Math.round(b / 800 * 10) / 10;
    const sizeByArea = Math.floor(a / 100);
    const systemSize = Math.max(1, Math.min(sizeByBill, sizeByArea));
    
    const monthlySavings = Math.round(b * 0.85);
    const yearlySavings = monthlySavings * 12;
    const approxCost = systemSize * 60000;
    const subsidy = systemSize <= 3 ? systemSize * 18000 : 54000;

    return { systemSize, monthlySavings, yearlySavings, approxCost, subsidy };
  }, [bill, area]);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient 
        colors={['rgba(255, 215, 0, 0.05)', 'rgba(255, 215, 0, 0.02)']} 
        style={StyleSheet.absoluteFill} 
      />
      <View style={styles.header}>
        <View style={{ backgroundColor: '#FFD700', padding: 8, borderRadius: 10 }}>
          <IconSymbol name="sun.max.fill" size={20} color="#000" />
        </View>
        <ThemedText type="subtitle" style={styles.title}>Smart Recommendation</ThemedText>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputGrid}>
          <View style={styles.inputItem}>
            <ThemedText style={styles.label}>PINCODE</ThemedText>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              placeholder="208001"
              placeholderTextColor="rgba(255,255,255,0.2)"
              maxLength={6}
            />
          </View>
          <View style={styles.inputItem}>
            <ThemedText style={styles.label}>MONTHLY BILL</ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#FFD700', marginRight: 4 }}>₹</ThemedText>
              <TextInput
                style={[styles.input, { color: themeColors.text, flex: 1 }]}
                value={bill}
                onChangeText={setBill}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGrid}>
          <View style={styles.inputItem}>
            <ThemedText style={styles.label}>ROOF AREA (SQFT)</ThemedText>
            <TextInput
              style={[styles.input, { color: themeColors.text }]}
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputItem}>
            <ThemedText style={styles.label}>ROOF TYPE</ThemedText>
            <View style={styles.roofTypeContainer}>
              {ROOF_TYPES.map(type => (
                <TouchableOpacity 
                  key={type}
                  onPress={() => setRoofType(type)}
                  style={[
                    styles.roofChip,
                    roofType === type && { backgroundColor: '#FFD700' }
                  ]}
                >
                  <ThemedText style={[styles.roofChipText, roofType === type && { color: '#000', fontWeight: 'bold' }]}>
                    {type.split(' ')[0]}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.recommendationBox}>
        <View style={styles.recHeader}>
          <View>
            <ThemedText style={styles.recLabel}>OPTIMAL SYSTEM SIZE</ThemedText>
            <ThemedText type="title" style={styles.recValue}>{results.systemSize} kW</ThemedText>
          </View>
          <View style={styles.badge}>
            <IconSymbol name="checkmark.seal.fill" size={12} color="#fff" />
            <ThemedText style={styles.badgeText}>ELIGIBLE</ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Investment" value={`₹${(results.approxCost/100000).toFixed(1)}L`} icon="creditcard.fill" />
          <StatBox label="Govt Subsidy" value={`₹${(results.subsidy/1000).toFixed(0)}k`} icon="gift.fill" />
          <StatBox label="Annual Saving" value={`₹${(results.yearlySavings/1000).toFixed(0)}k`} icon="arrow.up.circle.fill" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity style={[styles.button, { flex: 2 }]} onPress={onOrder}>
          <ThemedText style={styles.buttonText}>Book Site Survey</ThemedText>
          <IconSymbol name="chevron.right" size={18} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)' }]}
          onPress={() => {/* Agent Help */}}
        >
          <ThemedText style={[styles.buttonText, { color: '#FFD700', fontSize: 13 }]}>Expert Call</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={styles.statBox}>
      <IconSymbol name={icon as any} size={14} color="rgba(255,215,0,0.4)" style={{ marginBottom: 4 }} />
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 32,
    margin: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  inputItem: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    opacity: 0.4,
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    fontSize: 20,
    fontWeight: '900',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.1)',
  },
  roofTypeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  roofChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  roofChipText: {
    fontSize: 9,
  },
  recommendationBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  recLabel: {
    fontSize: 10,
    fontWeight: '900',
    opacity: 0.5,
    letterSpacing: 1,
  },
  recValue: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: '900',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    borderRadius: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    opacity: 0.4,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '900',
  },
  button: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 20,
    gap: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
  footerNote: {
    fontSize: 10,
    opacity: 0.3,
    textAlign: 'center',
    marginTop: 16,
  }
});
