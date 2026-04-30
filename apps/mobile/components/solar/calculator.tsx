import React, { useState, useMemo } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
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
    
    // Logic: 1kW needs ~100 sqft. Recommended size is based on bill, but capped by area.
    const sizeByBill = Math.round(b / 800 * 10) / 10;
    const sizeByArea = Math.floor(a / 100);
    const systemSize = Math.max(1, Math.min(sizeByBill, sizeByArea));
    
    const monthlySavings = Math.round(b * 0.85);
    const yearlySavings = monthlySavings * 12;
    const approxCost = systemSize * 60000; // ~60k per kW
    const subsidy = systemSize <= 3 ? systemSize * 18000 : 54000; // PM Surya Ghar logic simplified

    return { systemSize, monthlySavings, yearlySavings, approxCost, subsidy };
  }, [bill, area]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <IconSymbol name="sun.max.fill" size={24} color="#FFD700" />
        <ThemedText type="subtitle" style={styles.title}>One-Step Solar Recommendation</ThemedText>
      </ThemedView>

      <View style={styles.inputGrid}>
        <View style={styles.inputItem}>
          <ThemedText style={styles.label}>Pincode</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.tabIconDefault }]}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
            placeholder="208001"
            maxLength={6}
          />
        </View>
        <View style={styles.inputItem}>
          <ThemedText style={styles.label}>Monthly Bill (₹)</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.tabIconDefault }]}
            value={bill}
            onChangeText={setBill}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputGrid}>
        <View style={styles.inputItem}>
          <ThemedText style={styles.label}>Roof Area (sqft)</ThemedText>
          <TextInput
            style={[styles.input, { color: themeColors.text, borderColor: themeColors.tabIconDefault }]}
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputItem}>
          <ThemedText style={styles.label}>Roof Type</ThemedText>
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
                <ThemedText style={[styles.roofChipText, roofType === type && { color: '#000' }]}>
                  {type.split(' ')[0]}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.recommendationBox}>
        <View style={styles.recRow}>
          <View>
            <ThemedText style={styles.recLabel}>Recommended System</ThemedText>
            <ThemedText type="title" style={styles.recValue}>{results.systemSize} kW</ThemedText>
          </View>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>PM Surya Ghar Eligible</ThemedText>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatBox label="Est. Cost" value={`₹${(results.approxCost/100000).toFixed(1)}L`} />
          <StatBox label="Subsidy" value={`₹${(results.subsidy/1000).toFixed(0)}k`} />
          <StatBox label="Savings/yr" value={`₹${(results.yearlySavings/1000).toFixed(0)}k`} />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity style={[styles.button, { flex: 2 }]} onPress={onOrder}>
          <ThemedText style={styles.buttonText}>Order Now</ThemedText>
          <IconSymbol name="chevron.right" size={18} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FFD700' }]}
          onPress={() => {/* Agent Help */}}
        >
          <IconSymbol name="person.fill" size={18} color="#FFD700" />
          <ThemedText style={[styles.buttonText, { color: '#FFD700', fontSize: 12 }]}>Agent Help</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.footerNote}>
        *Includes solar kit + standard installation + net metering
      </ThemedText>
    </ThemedView>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  title: {
    fontSize: 16,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  inputItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 6,
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  roofTypeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  roofChip: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  roofChipText: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  recommendationBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    marginBottom: 20,
  },
  recRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  recValue: {
    color: '#FFD700',
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.6,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerNote: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 12,
  }
});
