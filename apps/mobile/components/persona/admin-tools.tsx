import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { apiUrl } from '@/constants/api';

const { width } = Dimensions.get('window');

export function AdminTools() {
  const [stats, setStats] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, partnersRes] = await Promise.all([
        fetch(apiUrl('/api/admin/stats')),
        fetch(apiUrl('/api/admin/partners/pending'))
      ]);
      
      const statsData = await statsRes.json();
      const partnersData = await partnersRes.json();
      
      setStats(statsData);
      setPartners(partnersData);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
    >
      {/* Ecosystem Pulse */}
      <View style={styles.headerRow}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Ecosystem Pulse</ThemedText>
        <TouchableOpacity onPress={onRefresh}>
          <IconSymbol name="arrow.clockwise" size={16} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>
      </View>

      <View style={styles.pulseGrid}>
        <PulseCard 
          label="Active Users" 
          value={stats?.activeUsers || '0'} 
          sub="+12% today" 
          color="#2196F3" 
          icon="person.2.fill" 
        />
        <PulseCard 
          label="Total Gen" 
          value={stats?.totalGeneration || '0 GWh'} 
          sub="Saving 2.4k tons CO2" 
          color="#4CAF50" 
          icon="leaf.fill" 
        />
        <PulseCard 
          label="System Revenue" 
          value={stats?.systemRevenue || '₹0'} 
          sub="MTD Target: 85%" 
          color="#FFD700" 
          icon="indianrupeesign.circle.fill" 
        />
        <PulseCard 
          label="Open Support" 
          value={stats?.openSupport || '0'} 
          sub="Avg. response: 12m" 
          color="#FF5252" 
          icon="headphones" 
        />
      </View>

      {/* Partner Onboarding */}
      <View style={styles.headerRow}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Partner Approvals</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{partners.length}</ThemedText>
        </View>
      </View>

      <View style={styles.partnerList}>
        {partners.length > 0 ? (
          partners.map((partner, index) => (
            <PartnerRow 
              key={partner.id || index}
              name={partner.name} 
              type={partner.type} 
              status={partner.status} 
            />
          ))
        ) : (
          <ThemedText style={styles.emptyText}>No pending approvals</ThemedText>
        )}
      </View>

      {/* Service Health */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Infrastructure</ThemedText>
      <View style={styles.healthCard}>
        {stats?.infrastructure?.map((item: any, index: number) => (
          <HealthItem 
            key={index}
            label={item.label} 
            status={item.status} 
            latency={item.latency} 
            color={item.color} 
          />
        ))}
      </View>
    </ScrollView>
  );
}

function PulseCard({ label, value, sub, color, icon }: any) {
  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)']}
      style={styles.pulseCard}
    >
      <View style={[styles.pulseIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <ThemedText style={styles.pulseLabel}>{label}</ThemedText>
      <ThemedText style={styles.pulseValue}>{value}</ThemedText>
      <View style={styles.subRow}>
        <View style={[styles.trendDot, { backgroundColor: color }]} />
        <ThemedText style={[styles.pulseSub, { color }]}>{sub}</ThemedText>
      </View>
    </LinearGradient>
  );
}

function PartnerRow({ name, type, status }: any) {
  return (
    <TouchableOpacity style={styles.partnerRow}>
      <LinearGradient
        colors={['rgba(255,255,255,0.03)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.partnerGradient}
      >
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.partnerName}>{name}</ThemedText>
          <ThemedText style={styles.partnerType}>{type}</ThemedText>
        </View>
        <View style={styles.statusBadge}>
          <ThemedText style={styles.statusText}>{status}</ThemedText>
        </View>
        <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.3)" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

function HealthItem({ label, status, latency, color }: any) {
  return (
    <View style={styles.healthItem}>
      <View style={[styles.healthDot, { backgroundColor: color }]} />
      <ThemedText style={styles.healthLabel}>{label}</ThemedText>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <ThemedText style={[styles.healthStatus, { color }]}>{status}</ThemedText>
        <ThemedText style={styles.healthLatency}>{latency}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pulseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pulseCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pulseIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pulseValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  trendDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  pulseSub: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  partnerList: {
    gap: 12,
  },
  partnerRow: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  partnerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  partnerType: {
    fontSize: 12,
    opacity: 0.4,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ccc',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.3,
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  healthCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },
  healthDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  healthLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  healthStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  healthLatency: {
    fontSize: 10,
    opacity: 0.3,
    marginTop: 2,
  }
});

