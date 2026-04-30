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
  withSequence 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const APP_VARIANT = Constants.expoConfig?.extra?.appVariant || 'customer';
const IS_DEMO_MODE = Constants.expoConfig?.extra?.isDemoMode;

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
  const [demoRole, setDemoRole] = useState<'customer' | 'vendor' | 'technician' | null>(IS_DEMO_MODE ? null : (APP_VARIANT as any));

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
        setFeaturedKits(data.products.filter((p: Kit) => p.category === 'Kits'));
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
        <LinearGradient colors={['#050505', '#121212']} style={StyleSheet.absoluteFill} />
        
        <Animated.View style={{ alignItems: 'center', marginBottom: 48, opacity: 1 }}>
          <View style={[styles.logoCircle, { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
             <IconSymbol name="sun.max.fill" size={50} color="#FFD700" />
          </View>
          <ThemedText type="title" style={{ fontSize: 48, marginTop: 24, fontWeight: '900', color: '#fff' }}>SolarHub</ThemedText>
          <ThemedText style={{ opacity: 0.5, letterSpacing: 2, fontSize: 12, marginTop: 8 }}>PREMIUM ECOSYSTEM</ThemedText>
        </Animated.View>

        <View style={{ gap: 20 }}>
          <LauncherCard 
            title="Customer" 
            desc="Solar marketplace, calculators & govt. subsidy" 
            icon="person.fill" 
            color="#FFD700" 
            onPress={() => setDemoRole('customer')} 
          />
          <LauncherCard 
            title="Vendor" 
            desc="Orders, dispatch & inventory management" 
            icon="storefront.fill" 
            color="#FFA500" 
            onPress={() => setDemoRole('vendor')} 
          />
          <LauncherCard 
            title="Technician" 
            desc="Field service, installation & maintenance" 
            icon="wrench.fill" 
            color="#4CAF50" 
            onPress={() => setDemoRole('technician')} 
          />
        </View>

        <View style={{ position: 'absolute', bottom: 40, alignSelf: 'center' }}>
          <ThemedText style={{ opacity: 0.3, fontSize: 10 }}>V1.0.0 • MARKET DEMO</ThemedText>
        </View>
      </View>
    );
  }

  if (demoRole === 'vendor') {
    return <VendorDashboard onBack={() => setDemoRole(IS_DEMO_MODE ? null : 'vendor')} />;
  }

  if (demoRole === 'technician') {
    return <TechnicianDashboard onBack={() => setDemoRole(IS_DEMO_MODE ? null : 'technician')} />;
  }


  // ... (rest of the customer view logic)

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
            <TouchableOpacity 
              onPress={() => setDemoRole(null)}
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <ThemedText style={{ fontSize: 10, fontWeight: '900', color: '#FFD700' }}>EXIT DEMO</ThemedText>
            </TouchableOpacity>
          </View>
          <ThemedText style={[styles.heroSubtitle, { fontSize: 16, opacity: 0.6, marginTop: 12, lineHeight: 24 }]}>
            Experience the future of renewable energy with India's most advanced solar ecosystem.
          </ThemedText>
        </View>
      </View>

      {/* Demo Role Switcher (Visible for Market Showcase) */}
      {IS_DEMO_MODE && (
        <View style={styles.roleSwitcher}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <Animated.View style={[
              { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD700' },
              animatedPulseStyle
            ]} />
            <ThemedText style={[styles.roleTitle, { marginBottom: 0 }]}>MARKET DEMO MODE</ThemedText>
          </View>
          <View style={styles.roleRow}>
            <RoleTab active={demoRole === 'customer'} label="Customer" icon="person.fill" onPress={() => setDemoRole('customer')} />
            <RoleTab active={demoRole === 'vendor'} label="Vendor" icon="storefront.fill" onPress={() => setDemoRole('vendor')} />
            <RoleTab active={demoRole === 'technician'} label="Service" icon="wrench.fill" onPress={() => setDemoRole('technician')} />
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

      {/* Govt Schemes Section (New) */}
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

function LauncherCard({ title, desc, icon, color, onPress }: { title: string; desc: string; icon: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#1A1A1A', '#0D0D0D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 20,
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
        <View style={{ backgroundColor: color + '15', padding: 18, borderRadius: 20 }}>
          <IconSymbol name={icon as any} size={36} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>{title}</ThemedText>
          <ThemedText style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>{desc}</ThemedText>
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 12 }}>
          <IconSymbol name="chevron.right" size={18} color="#666" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
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

// Full Operational Vendor Dashboard
function VendorDashboard({ onBack }: { onBack: () => void }) {
  const [orders, setOrders] = useState([
    { id: '101', customer: 'Amit Sharma', items: '5kW Tata Solar Kit', status: 'pending', price: '₹2,85,000', location: 'Kanpur', date: 'Today' },
    { id: '102', customer: 'Rahul Verma', items: '3kW Luminous Hybrid', status: 'accepted', price: '₹1,95,000', location: 'Lucknow', date: 'Yesterday' }
  ]);

  const handleAccept = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'accepted' } : o));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <LinearGradient 
         colors={['#121212', '#0A0A0A']} 
         style={{ height: 260, padding: 24, justifyContent: 'flex-end' }}
       >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <ThemedText style={{ color: '#FFD700', fontSize: 12, fontWeight: '900', letterSpacing: 2 }}>VENDOR HUB</ThemedText>
              <ThemedText type="title" style={{ color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 }}>Tata Power</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' }} />
                <ThemedText style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>Active Storefront</ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={onBack} style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16 }}>
              <IconSymbol name="xmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <QuickStat label="Revenue" value="₹12.4L" sub="+14% this week" color="#FFD700" />
            <QuickStat label="Orders" value="48" sub="12 pending" color="#FFA500" />
          </View>
       </LinearGradient>

       <View style={[styles.section, { marginTop: 0 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <ThemedText type="subtitle">Active Inquiries</ThemedText>
            <TouchableOpacity>
              <ThemedText style={{ color: '#FFD700', fontSize: 12, fontWeight: 'bold' }}>VIEW HISTORY</ThemedText>
            </TouchableOpacity>
          </View>

          {orders.map(order => (
            <View key={order.id} style={styles.vendorOrderCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,215,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                    <ThemedText style={{ color: '#FFD700', fontWeight: 'bold' }}>{order.customer[0]}</ThemedText>
                  </View>
                  <View>
                    <ThemedText style={{ fontWeight: 'bold', fontSize: 16 }}>{order.customer}</ThemedText>
                    <ThemedText style={{ fontSize: 12, opacity: 0.5 }}>{order.location} • {order.date}</ThemedText>
                  </View>
                </View>
                <ThemedText style={{ color: '#FFD700', fontWeight: '900' }}>{order.price}</ThemedText>
              </View>
              
              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12, marginBottom: 16 }}>
                <ThemedText style={{ fontSize: 13, opacity: 0.8 }}>{order.items}</ThemedText>
              </View>

              {order.status === 'pending' ? (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity 
                    onPress={() => handleAccept(order.id)}
                    style={{ flex: 2, backgroundColor: '#FFD700', padding: 14, borderRadius: 14, alignItems: 'center' }}
                  >
                    <ThemedText style={{ color: '#000', fontWeight: '900' }}>Accept Order</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 14, alignItems: 'center' }}>
                    <ThemedText style={{ color: '#FF5252', fontWeight: 'bold' }}>Reject</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <IconSymbol name="checkmark.circle.fill" size={18} color="#4CAF50" />
                    <ThemedText style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: 14 }}>Accepted</ThemedText>
                  </View>
                  <TouchableOpacity style={{ backgroundColor: 'rgba(76,175,80,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                    <ThemedText style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>DISPATCH KIT</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <ThemedText type="subtitle" style={{ marginTop: 24, marginBottom: 16 }}>Inventory Health</ThemedText>
          <View style={styles.inventoryCard}>
             <InventoryItem label="5kW Inverters" count={8} total={10} color="#FFD700" />
             <InventoryItem label="330W Mono Panels" count={142} total={200} color="#4CAF50" />
             <InventoryItem label="Structure Sets" count={2} total={15} color="#FF5252" />
          </View>
       </View>
       <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function QuickStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
      <ThemedText style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>{label}</ThemedText>
      <ThemedText style={{ fontSize: 24, fontWeight: '900', color }}>{value}</ThemedText>
      <ThemedText style={{ fontSize: 10, color, opacity: 0.8, marginTop: 2 }}>{sub}</ThemedText>
    </View>
  );
}

function InventoryItem({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const percent = (count / total) * 100;
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <ThemedText style={{ fontSize: 13, opacity: 0.8 }}>{label}</ThemedText>
        <ThemedText style={{ fontSize: 13, fontWeight: 'bold' }}>{count}/{total}</ThemedText>
      </View>
      <View style={{ height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
        <View style={{ width: `${percent}%`, height: 4, backgroundColor: color, borderRadius: 2 }} />
      </View>
    </View>
  );
}

// Full Operational Technician Dashboard
function TechnicianDashboard({ onBack }: { onBack: () => void }) {
  const [tasks, setTasks] = useState([
    { id: 'T1', type: 'Site Survey', customer: 'Amit Sharma', address: '12/A, Civil Lines, Kanpur', status: 'pending', priority: 'High' },
    { id: 'T2', type: 'Installation', customer: 'Rahul Verma', address: 'Indira Nagar, Sector 14', status: 'upcoming', priority: 'Medium' }
  ]);

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <LinearGradient 
         colors={['#0D47A1', '#1A237E']} 
         style={{ height: 260, padding: 24, justifyContent: 'flex-end' }}
       >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <ThemedText style={{ color: '#64B5F6', fontSize: 12, fontWeight: '900', letterSpacing: 2 }}>FIELD SERVICE</ThemedText>
              <ThemedText type="title" style={{ color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 }}>Installer Pro</ThemedText>
              <ThemedText style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 }}>Welcome back, Sumit</ThemedText>
            </View>
            <TouchableOpacity onPress={onBack} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16 }}>
              <IconSymbol name="xmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={{ backgroundColor: '#FFD700', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <IconSymbol name="clock.fill" size={20} color="#000" />
            </View>
            <View>
              <ThemedText style={{ color: '#000', fontWeight: 'bold' }}>Next: {tasks[0].type}</ThemedText>
              <ThemedText style={{ color: '#000', opacity: 0.6, fontSize: 12 }}>Arrive by 10:30 AM (In 45 mins)</ThemedText>
            </View>
          </View>
       </LinearGradient>

       <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <ThemedText type="subtitle">Today's Jobs</ThemedText>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <ThemedText style={{ fontSize: 10, color: '#64B5F6', fontWeight: 'bold' }}>2 JOBS LEFT</ThemedText>
            </View>
          </View>

          {tasks.map(task => (
            <View key={task.id} style={styles.techJobCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ backgroundColor: task.priority === 'High' ? '#FF525220' : '#4CAF5020', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <ThemedText style={{ color: task.priority === 'High' ? '#FF5252' : '#4CAF50', fontSize: 10, fontWeight: 'bold' }}>{task.priority} Priority</ThemedText>
                </View>
                <ThemedText style={{ fontSize: 12, opacity: 0.5 }}>#{task.id}</ThemedText>
              </View>

              <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
                <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                  <IconSymbol name={task.type === 'Installation' ? 'wrench.fill' : 'doc.text.fill'} size={24} color="#64B5F6" />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{task.type}</ThemedText>
                  <ThemedText style={{ fontSize: 14, opacity: 0.7, marginTop: 2 }}>{task.customer}</ThemedText>
                  <ThemedText style={{ fontSize: 12, opacity: 0.5, marginTop: 4 }}>{task.address}</ThemedText>
                </View>
              </View>

              {task.status !== 'completed' ? (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity 
                    onPress={() => handleComplete(task.id)}
                    style={{ flex: 2, backgroundColor: '#64B5F6', padding: 14, borderRadius: 14, alignItems: 'center' }}
                  >
                    <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>Start Job</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 14, borderRadius: 14, alignItems: 'center' }}>
                    <IconSymbol name="location.fill" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(76,175,80,0.1)', padding: 12, borderRadius: 12 }}>
                  <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
                  <ThemedText style={{ color: '#4CAF50', fontWeight: 'bold' }}>Job Completed</ThemedText>
                </View>
              )}
            </View>
          ))}
       </View>
       <View style={{ height: 100 }} />
    </ScrollView>
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
  roleSwitcher: {
    margin: 16,
    marginTop: -20,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    elevation: 5,
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 12,
    textAlign: 'center',
  },
  roleRow: {
    flexDirection: 'row',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  roleTabActive: {
    backgroundColor: '#FFD700',
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  glassPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  vendorOrderCard: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inventoryCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  techJobCard: {
    backgroundColor: '#121212',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  }
});

