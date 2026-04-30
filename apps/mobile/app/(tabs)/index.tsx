import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SolarCalculator } from '@/components/solar/calculator';
import { ProductCard } from '@/components/solar/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { apiUrl } from '@/constants/api';
import Constants from 'expo-constants';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  FadeInDown,
  FadeInRight,
  interpolate,
  withSpring
} from 'react-native-reanimated';

import { CustomerTools } from '@/components/persona/customer-tools';
import { AdminDashboard } from '@/components/persona/admin-dashboard';
import { VendorDashboard } from '@/components/persona/vendor-dashboard';
import { TechnicianDashboard } from '@/components/persona/technician-dashboard';
import { NotificationCenter } from '@/components/solar/notification-center';
import * as Haptics from 'expo-haptics';

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
  const [demoRole, setDemoRole] = useState<'customer' | 'vendor' | 'technician' | 'admin' | null>(Constants.expoConfig?.extra?.isDemoMode ? null : (Constants.expoConfig?.extra?.appVariant as any));
  const [showNotifications, setShowNotifications] = useState(false);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value * 0.8,
  }));

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        if (data && data.products) {
          setFeaturedKits(data.products.filter((p: Kit) => p.category === 'Kits'));
        }
      })
      .catch(err => {
        setFeaturedKits([
          { id: 101, title: 'Premium On-Grid Kit 5kW', price: 285000, category: 'Kits', vendor: 'Tata Power', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d', description: '5kW on-grid kit' },
          { id: 102, title: 'Essential Hybrid Kit 3kW', price: 195000, category: 'Kits', vendor: 'Luminous', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d', description: '3kW hybrid kit' }
        ]);
      });
  }, []);

  // ROLE SELECTION OVERLAY (For the Demo Launch)
  if (!demoRole) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 24 }]}>
        <LinearGradient colors={['#050505', '#0A0A0A', '#121212']} style={StyleSheet.absoluteFill} />
        
        <Animated.View entering={FadeInDown.duration(800)} style={{ alignItems: 'center', marginBottom: 48 }}>
          <View style={[styles.logoCircle, { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 215, 0, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.2)' }]}>
             <IconSymbol name="sun.max.fill" size={60} color="#FFD700" />
          </View>
          <ThemedText type="title" style={{ fontSize: 56, marginTop: 24, fontWeight: '900', color: '#fff', letterSpacing: -2 }}>SolarHub</ThemedText>
          <ThemedText style={{ color: '#FFD700', letterSpacing: 4, fontSize: 10, fontWeight: '900', marginTop: 4 }}>PREMIUM ECOSYSTEM</ThemedText>
        </Animated.View>

        <View style={{ gap: 16 }}>
          <LauncherCard 
            title="Customer" 
            desc="Marketplace & Energy Monitoring" 
            icon="person.fill" 
            color="#FFD700" 
            delay={200}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setDemoRole('customer');
            }} 
          />
          <LauncherCard 
            title="Vendor" 
            desc="Storefront & Lead Management" 
            icon="storefront.fill" 
            color="#FFB800" 
            delay={300}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setDemoRole('vendor');
            }} 
          />
          <LauncherCard 
            title="Technician" 
            desc="Field Ops & Training Toolbox" 
            icon="wrench.fill" 
            color="#4CAF50" 
            delay={400}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setDemoRole('technician');
            }} 
          />
          <LauncherCard 
            title="Admin" 
            desc="Ecosystem Pulse & Health" 
            icon="shield.fill" 
            color="#2196F3" 
            delay={500}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setDemoRole('admin');
            }} 
          />
        </View>

        <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
          <ThemedText style={{ opacity: 0.3, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }}>V1.2.0 • ADVANCED MARKET DEMO</ThemedText>
        </View>
      </View>
    );
  }

  if (demoRole === 'vendor') {
    return <VendorDashboard onBack={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDemoRole(Constants.expoConfig?.extra?.isDemoMode ? null : 'vendor'); }} />;
  }

  if (demoRole === 'technician') {
    return <TechnicianDashboard onBack={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDemoRole(Constants.expoConfig?.extra?.isDemoMode ? null : 'technician'); }} />;
  }

  if (demoRole === 'admin') {
    return <AdminDashboard onBack={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDemoRole(Constants.expoConfig?.extra?.isDemoMode ? null : 'admin'); }} />;
  }

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
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={[styles.logoCircle, { shadowColor: '#FFD700', shadowOpacity: 0.8, shadowRadius: 15 }]}>
                <IconSymbol name="sun.max.fill" size={28} color="#FFD700" />
              </View>
              <View style={{ marginLeft: 16 }}>
                <ThemedText type="title" style={[styles.logoText, { fontSize: 32, fontWeight: '900', letterSpacing: -1.5 }]}>SolarHub</ThemedText>
                <ThemedText style={{ color: '#FFD700', fontSize: 10, fontWeight: '900', letterSpacing: 2 }}>PREMIUM EDITION</ThemedText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setShowNotifications(true);
                }}
                style={styles.backButton}
              >
                <IconSymbol name="bell.fill" size={16} color="#FFD700" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setDemoRole(null)}
                style={styles.backButton}
              >
                <IconSymbol name="chevron.left" size={16} color="#FFD700" />
                <ThemedText style={styles.backButtonText}>EXIT DEMO</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          <ThemedText style={[styles.heroSubtitle, { fontSize: 16, opacity: 0.6, marginTop: 12, lineHeight: 24 }]}>
            Experience the future of renewable energy with India&apos;s most advanced solar ecosystem.
          </ThemedText>
        </View>
      </View>

      {/* Demo Role Switcher (Visible for Market Showcase) */}
      {Constants.expoConfig?.extra?.isDemoMode && (
        <View style={styles.roleSwitcher}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Animated.View style={[
              { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700' },
              animatedPulseStyle
            ]} />
            <ThemedText style={[styles.roleTitle, { marginBottom: 0 }]}>MARKET DEMO MODE</ThemedText>
          </View>
          <View style={styles.roleRow}>
            <RoleTab active={(demoRole as any) === 'customer'} label="User" icon="person.fill" onPress={() => setDemoRole('customer')} />
            <RoleTab active={(demoRole as any) === 'vendor'} label="Vendor" icon="storefront.fill" onPress={() => setDemoRole('vendor')} />
            <RoleTab active={(demoRole as any) === 'technician'} label="Service" icon="wrench.fill" onPress={() => setDemoRole('technician')} />
            <RoleTab active={(demoRole as any) === 'admin'} label="Admin" icon="shield.fill" onPress={() => setDemoRole('admin')} />
          </View>
        </View>
      )}

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

      {/* Govt Schemes Section */}
      <ThemedView style={[styles.section, { paddingTop: 0 }]}>
        <LinearGradient 
          colors={['#050505', '#1A1A1A']} 
          style={{ borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,215,0,0.1)' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <ThemedText style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>Govt. Subsidy</ThemedText>
                <View style={{ backgroundColor: '#FF5252', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                  <ThemedText style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>LIVE</ThemedText>
                </View>
              </View>
              <ThemedText style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold' }}>PM SURYA GHAR YOJANA</ThemedText>
            </View>
            <View style={{ backgroundColor: 'rgba(255,215,0,0.1)', padding: 12, borderRadius: 16 }}>
              <IconSymbol name="checkmark.seal.fill" size={24} color="#FFD700" />
            </View>
          </View>
          <ThemedText style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20, lineHeight: 20 }}>
            Get up to ₹78,000 direct subsidy in your bank account. Our certified agents handle the paperwork for you.
          </ThemedText>
          <TouchableOpacity style={{ backgroundColor: '#FFD700', borderRadius: 16, paddingVertical: 14, alignItems: 'center', shadowColor: '#FFD700', shadowOpacity: 0.3, shadowRadius: 10 }}>
            <ThemedText style={{ color: '#000', fontWeight: '900' }}>Check Eligibility</ThemedText>
          </TouchableOpacity>
        </LinearGradient>
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

      {/* Customer Work Tools */}
      <View style={styles.section}>
        <CustomerTools />
      </View>

      <NotificationCenter 
        visible={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

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

function LauncherCard({ title, desc, icon, color, onPress, delay = 0 }: { title: string; desc: string; icon: string; color: string; onPress: () => void; delay?: number }) {
  const pressed = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(interpolate(pressed.value, [0, 1], [1, 0.98])) }],
  }));

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(600)} style={animatedStyle}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={() => (pressed.value = 1)}
        onPressOut={() => (pressed.value = 0)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#1A1A1A', '#0D0D0D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 28,
            padding: 24,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            shadowColor: color,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View style={{ backgroundColor: color + '15', padding: 20, borderRadius: 22 }}>
            <IconSymbol name={icon as any} size={40} color={color} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>{title}</ThemedText>
            <ThemedText style={{ fontSize: 13, opacity: 0.5, marginTop: 4, lineHeight: 18 }}>{desc}</ThemedText>
          </View>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 14 }}>
            <IconSymbol name="chevron.right" size={20} color="#666" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function RoleTab({ active, label, icon, onPress }: { active: boolean; label: string; icon: string; onPress: () => void }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.roleTab, active && styles.roleTabActive]}
    >
      <IconSymbol name={icon as any} size={16} color={active ? '#000' : '#888'} />
      <ThemedText style={[styles.roleLabel, { color: active ? '#000' : '#888' }]}>{label}</ThemedText>
    </TouchableOpacity>
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
  hero: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerContent: {
    paddingHorizontal: 24,
    position: 'relative',
    zIndex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  roleSwitcher: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
    color: '#FFD700',
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  roleTabActive: {
    backgroundColor: '#FFD700',
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  techJobCard: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
  },
  backButtonRound: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
