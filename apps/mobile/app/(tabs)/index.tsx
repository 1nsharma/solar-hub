import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SolarCalculator } from '@/components/solar/calculator';
import { ProductCard } from '@/components/solar/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { apiUrl } from '@/constants/api';

const { width } = Dimensions.get('window');

type Kit = {
  id: string | number;
  title: string;
  price: number;
  category: string;
  vendor: string;
  rating: number;
  image_url: string;
  description: string;
};

export default function HomeScreen() {
  const [featuredKits, setFeaturedKits] = useState<Kit[]>([]);
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, ordered

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        setFeaturedKits(data.products.filter((p: Kit) => p.category === 'Kits'));
      })
      .catch(err => {
        console.log('Using mock data for featured kits');
        setFeaturedKits([
          { id: 101, title: 'Premium On-Grid Kit 5kW', price: 285000, category: 'Kits', vendor: 'Tata Power', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d', description: '5kW on-grid kit' },
          { id: 102, title: 'Essential Hybrid Kit 3kW', price: 195000, category: 'Kits', vendor: 'Luminous', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d', description: '3kW hybrid kit' }
        ]);
      });
  }, []);

  if (orderStatus === 'ordered') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { height: 300 }]}>
          <LinearGradient colors={['#4CAF50', '#2E7D32']} style={StyleSheet.absoluteFill} />
          <View style={styles.headerContent}>
            <IconSymbol name="checkmark.circle.fill" size={60} color="#fff" />
            <ThemedText type="title" style={[styles.logoText, { marginTop: 16 }]}>Order Confirmed!</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Your One-Step Solar journey has started.</ThemedText>
          </View>
        </View>

        <ThemedView style={[styles.section, { marginTop: -40, borderRadius: 24, marginHorizontal: 16, elevation: 10 }]}>
          <ThemedText type="subtitle" style={{ marginBottom: 20 }}>Installation Tracking</ThemedText>
          
          <TimelineItem 
            status="completed" 
            title="Installer Locked" 
            desc="SolarHub Team Alpha (Rated 4.9/5) assigned." 
            time="Just now" 
          />
          <TimelineItem 
            status="active" 
            title="Site Survey" 
            desc="Scheduled for Tomorrow, 10:00 AM." 
            time="Expected" 
          />
          <TimelineItem 
            status="pending" 
            title="Product Dispatch" 
            desc="Tata Power 5kW Kit (Warehouse: Kanpur)." 
            time="T+2 Days" 
          />
          <TimelineItem 
            status="pending" 
            title="Installation & Net Metering" 
            desc="Team arrives for final setup." 
            time="T+5 Days" 
          />

          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => setOrderStatus('idle')}>
            <ThemedText style={styles.buttonText}>Back to Dashboard</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={StyleSheet.absoluteFill}
        />
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255, 215, 0, 0.05)'}} />
        <View style={styles.headerContent}>
          <View style={styles.logoRow}>
            <View style={[styles.logoCircle, { shadowColor: '#FFD700', shadowOpacity: 0.5, shadowRadius: 10 }]}>
              <IconSymbol name="sun.max.fill" size={28} color="#FFD700" />
            </View>
            <ThemedText type="title" style={[styles.logoText, { fontSize: 32, fontWeight: '900', letterSpacing: -1 }]}>SolarHub</ThemedText>
          </View>
          <ThemedText style={[styles.heroSubtitle, { fontSize: 16, opacity: 0.8, marginTop: 8 }]}>
            India's Leading Solar Ecosystem.
          </ThemedText>
        </View>
      </View>

      {/* Calculator Section */}
      <View style={styles.calculatorWrapper}>
        <SolarCalculator onOrder={() => setOrderStatus('ordered')} />
      </View>

      {/* One-Step Flow */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>How it Works</ThemedText>
        <View style={styles.flowRow}>
          <FlowItem icon="checklist" label="Choose" color="#2196F3" />
          <IconSymbol name="chevron.right" size={16} color="#ccc" />
          <FlowItem icon="cart.fill" label="Buy" color="#4CAF50" />
          <IconSymbol name="chevron.right" size={16} color="#ccc" />
          <FlowItem icon="wrench.fill" label="Install" color="#FF9800" />
        </View>
      </ThemedView>

      {/* Featured Kits */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Recommended Kits</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.viewAll}>View All</ThemedText>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        >
          {featuredKits.map(kit => (
            <View key={kit.id} style={styles.kitCardWrapper}>
              <ProductCard product={kit} />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function FlowItem({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <View style={styles.flowItem}>
      <View style={[styles.flowIcon, { backgroundColor: color + '20' }]}>
        <IconSymbol name={icon as any} size={20} color={color} />
      </View>
      <ThemedText style={styles.flowLabel}>{label}</ThemedText>
    </View>
  );
}

function TimelineItem({
  status,
  title,
  desc,
  time,
}: {
  status: 'completed' | 'active' | 'pending';
  title: string;
  desc: string;
  time: string;
}) {
  const color = status === 'completed' ? '#4CAF50' : status === 'active' ? '#FFD700' : '#999';

  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineDot, { backgroundColor: color }]} />
      <View style={styles.timelineBody}>
        <View style={styles.timelineHeader}>
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
          <ThemedText style={styles.timelineTime}>{time}</ThemedText>
        </View>
        <ThemedText style={styles.timelineDesc}>{desc}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: 240,
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 60,
  },
  headerContent: {
    zIndex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  calculatorWrapper: {
    marginTop: -40,
    zIndex: 2,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: 20,
    borderRadius: 20,
  },
  flowItem: {
    alignItems: 'center',
    gap: 8,
  },
  flowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  featuredList: {
    gap: 16,
  },
  kitCardWrapper: {
    width: width * 0.7,
  },
  button: {
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineBody: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timelineTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  timelineDesc: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 4,
  },
});
