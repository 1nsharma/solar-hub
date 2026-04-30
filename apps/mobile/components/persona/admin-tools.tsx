import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { apiUrl } from '@/constants/api';

const { width } = Dimensions.get('window');

// Designer Token: High-fidelity HSL Colors
const THEME = {
  primary: 'hsla(51, 100%, 50%, 1)', // Gold
  secondary: 'hsla(145, 63%, 49%, 1)', // Emerald
  bgGlass: 'hsla(0, 0%, 100%, 0.05)',
  bgGlassDeep: 'hsla(0, 0%, 100%, 0.02)',
  textDim: 'hsla(0, 0%, 100%, 0.4)',
};

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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={THEME.primary} />}
    >
      {/* Ecosystem Pulse */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Ecosystem Pulse</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
             <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: stats?.mock_mode ? '#FFA500' : '#4CAF50' }} />
             <ThemedText style={{ fontSize: 10, color: stats?.mock_mode ? '#FFA500' : '#4CAF50', fontWeight: 'bold', textTransform: 'uppercase' }}>
               {stats?.mock_mode ? 'Demo Engine' : 'Production Engine'}
             </ThemedText>
          </View>
        </View>
        <TouchableOpacity onPress={onRefresh}>
          <IconSymbol name="arrow.clockwise" size={16} color={THEME.textDim} />
        </TouchableOpacity>
      </View>

      <View style={styles.pulseGrid}>
        {loading && !refreshing ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
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
              color={THEME.secondary} 
              icon="leaf.fill" 
            />
            <PulseCard 
              label="System Revenue" 
              value={stats?.systemRevenue || '₹0'} 
              sub="MTD Target: 85%" 
              color={THEME.primary} 
              icon="indianrupeesign.circle.fill" 
            />
            <PulseCard 
              label="Open Support" 
              value={stats?.openSupport || '0'} 
              sub="Avg. response: 12m" 
              color="#FF5252" 
              icon="headphones" 
            />
          </>
        )}
      </View>

      {/* Partner Onboarding */}
      <View style={styles.headerRow}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Partner Approvals</ThemedText>
        {!loading && (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{partners.length}</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.partnerList}>
        {loading && !refreshing ? (
          <SkeletonRow />
        ) : partners.length > 0 ? (
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
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>Infrastructure</ThemedText>
      <View style={styles.healthCard}>
        {loading && !refreshing ? (
          <View style={{ gap: 12 }}>
             <View style={styles.skeletonLine} />
             <View style={styles.skeletonLine} />
          </View>
        ) : (
          stats?.infrastructure?.map((item: any, index: number) => (
            <HealthItem 
              key={index}
              label={item.label} 
              status={item.status} 
              latency={item.latency} 
              color={item.color} 
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

function PulseCard({ label, value, sub, color, icon }: any) {
  return (
    <LinearGradient
      colors={['hsla(0, 0%, 100%, 0.07)', 'hsla(0, 0%, 100%, 0.01)']}
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

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.pulseCard, { opacity, backgroundColor: 'hsla(0,0%,100%,0.05)' }]}>
      <View style={[styles.pulseIcon, { backgroundColor: 'hsla(0,0%,100%,0.1)' }]} />
      <View style={{ height: 10, width: '60%', backgroundColor: 'hsla(0,0%,100%,0.1)', borderRadius: 4, marginBottom: 8 }} />
      <View style={{ height: 20, width: '80%', backgroundColor: 'hsla(0,0%,100%,0.1)', borderRadius: 4 }} />
    </Animated.View>
  );
}

function SkeletonRow() {
  return (
    <View style={[styles.partnerRow, { height: 80, backgroundColor: 'hsla(0,0%,100%,0.03)', opacity: 0.5 }]} />
  );
}

function PartnerRow({ name, type, status }: any) {
  return (
    <TouchableOpacity style={styles.partnerRow}>
      <LinearGradient
        colors={['hsla(0, 0%, 100%, 0.04)', 'transparent']}
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
        <IconSymbol name="chevron.right" size={16} color={THEME.textDim} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'black',
  },
  pulseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pulseCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.08)',
  },
  pulseIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseLabel: {
    fontSize: 10,
    color: THEME.textDim,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  pulseValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  trendDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pulseSub: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  partnerList: {
    gap: 12,
  },
  partnerRow: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.05)',
  },
  partnerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  partnerName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  partnerType: {
    fontSize: 12,
    color: THEME.textDim,
    marginTop: 2,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#eee',
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    color: THEME.textDim,
    paddingVertical: 30,
    fontWeight: 'bold',
  },
  healthCard: {
    backgroundColor: 'hsla(0, 0%, 100%, 0.02)',
    borderRadius: 36,
    padding: 28,
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, 0.05)',
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  healthDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  healthLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  healthStatus: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  healthLatency: {
    fontSize: 10,
    color: THEME.textDim,
    marginTop: 2,
    fontWeight: 'bold',
  },
  skeletonLine: {
    height: 12,
    width: '100%',
    backgroundColor: 'hsla(0,0%,100%,0.05)',
    borderRadius: 6,
  }
});


