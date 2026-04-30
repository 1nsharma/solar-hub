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

const { width } = Dimensions.get('window');
const APP_VARIANT = Constants.expoConfig?.extra?.appVariant || 'customer';
const IS_FIXED_VARIANT = !!Constants.expoConfig?.extra?.appVariant;

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
  const [demoRole, setDemoRole] = useState<'customer' | 'vendor' | 'technician' | null>(IS_FIXED_VARIANT ? (APP_VARIANT as any) : null);

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
  if (!demoRole && !IS_FIXED_VARIANT) {
    return (
      <View style={[styles.container, { justifyContent: 'center', padding: 20 }]}>
        <LinearGradient colors={['#000', '#1A1A1A']} style={StyleSheet.absoluteFill} />
        <View style={{ alignItems: 'center', marginBottom: 50 }}>
          <View style={[styles.logoCircle, { width: 80, height: 80, borderRadius: 40 }]}>
             <IconSymbol name="sun.max.fill" size={40} color="#FFD700" />
          </View>
          <ThemedText type="title" style={{ fontSize: 40, marginTop: 20 }}>SolarHub</ThemedText>
          <ThemedText style={{ opacity: 0.6 }}>Select Demo Persona</ThemedText>
        </View>

        <View style={{ gap: 16 }}>
          <LauncherCard 
            title="Customer App" 
            desc="Marketplace, Calculator & Subsidy" 
            icon="person.fill" 
            color="#FFD700" 
            onPress={() => setDemoRole('customer')} 
          />
          <LauncherCard 
            title="Vendor App" 
            desc="Orders, Inventory & Dispatch" 
            icon="storefront.fill" 
            color="#FFA500" 
            onPress={() => setDemoRole('vendor')} 
          />
          <LauncherCard 
            title="Technician App" 
            desc="Field Jobs & Installation" 
            icon="wrench.fill" 
            color="#4CAF50" 
            onPress={() => setDemoRole('technician')} 
          />
        </View>
      </View>
    );
  }

  if (demoRole === 'vendor') {
    return <VendorDashboard onBack={() => setDemoRole(IS_FIXED_VARIANT ? 'vendor' : null)} />;
  }

  if (demoRole === 'technician') {
    return <TechnicianDashboard onBack={() => setDemoRole(IS_FIXED_VARIANT ? 'technician' : null)} />;
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
              <View style={[styles.logoCircle, { shadowColor: '#FFD700', shadowOpacity: 0.5, shadowRadius: 10 }]}>
                <IconSymbol name="sun.max.fill" size={28} color="#FFD700" />
              </View>
              <ThemedText type="title" style={[styles.logoText, { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginLeft: 12 }]}>SolarHub</ThemedText>
            </View>
            {!IS_FIXED_VARIANT && (
              <TouchableOpacity 
                onPress={() => setDemoRole(null)}
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
              >
                <ThemedText style={{ fontSize: 10, fontWeight: 'bold', color: '#FFD700' }}>SWITCH ROLE</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          <ThemedText style={[styles.heroSubtitle, { fontSize: 16, opacity: 0.8, marginTop: 8 }]}>
            India's Leading Solar Ecosystem.
          </ThemedText>
        </View>
      </View>

      {/* Demo Role Switcher (Visible for Market Showcase) */}
      {!IS_FIXED_VARIANT && (
        <View style={styles.roleSwitcher}>
          <ThemedText style={styles.roleTitle}>MARKET DEMO MODE</ThemedText>
          <View style={styles.roleRow}>
            <RoleTab active={demoRole === 'customer'} label="Customer" icon="person.fill" onPress={() => setDemoRole('customer')} />
            <RoleTab active={demoRole === 'vendor'} label="Vendor" icon="storefront.fill" onPress={() => setDemoRole('vendor')} />
            <RoleTab active={demoRole === 'technician'} label="Maintenance" icon="wrench.fill" onPress={() => setDemoRole('technician')} />
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
          colors={['#1A237E', '#0D47A1']} 
          style={{ borderRadius: 24, padding: 20, borderLeftWidth: 4, borderLeftColor: '#FFD700' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <ThemedText style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>Govt. Schemes & Subsidy</ThemedText>
              <ThemedText style={{ color: '#fff', opacity: 0.7, fontSize: 12 }}>Get up to ₹78,000 Subsidy</ThemedText>
            </View>
            <View style={{ backgroundColor: 'rgba(255,215,0,0.2)', padding: 8, borderRadius: 12 }}>
              <IconSymbol name="sun.max.fill" size={24} color="#FFD700" />
            </View>
          </View>
          <ThemedText style={{ color: '#fff', fontSize: 13, marginBottom: 16, lineHeight: 18 }}>
            PM Surya Ghar: Muft Bijli Yojana is now live! Apply today and get instant approval help from our certified agents.
          </ThemedText>
          <TouchableOpacity style={{ backgroundColor: '#FFD700', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}>
            <ThemedText style={{ color: '#000', fontWeight: 'bold' }}>Talk to Subsidy Agent</ThemedText>
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
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <View style={{ backgroundColor: color + '20', padding: 16, borderRadius: 16 }}>
        <IconSymbol name={icon as any} size={32} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</ThemedText>
        <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{desc}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#444" />
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
    { id: '101', customer: 'Amit Sharma', items: '5kW Tata Solar Kit', status: 'pending', price: '₹2,85,000' },
    { id: '102', customer: 'Rahul Verma', items: '3kW Luminous Hybrid', status: 'accepted', price: '₹1,95,000' }
  ]);

  const handleAccept = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'accepted' } : o));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <LinearGradient colors={['#FFD700', '#FFA500']} style={{ height: 220, padding: 20, justifyContent: 'flex-end', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText type="title" style={{ color: '#000', fontSize: 32 }}>Vendor Hub</ThemedText>
              <ThemedText style={{ color: '#000', opacity: 0.7, fontWeight: 'bold' }}>TATA POWER AUTHORIZED</ThemedText>
            </View>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 12, borderRadius: 20 }}>
              <IconSymbol name="storefront.fill" size={32} color="#000" />
            </View>
          </View>
       </LinearGradient>

       <View style={[styles.section, { marginTop: -30 }]}>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            <View style={[styles.glassPlaceholder, { flex: 1, padding: 16 }]}>
              <ThemedText style={{ fontSize: 24, fontWeight: '900', color: '#FFD700' }}>₹8.4L</ThemedText>
              <ThemedText style={{ fontSize: 10, color: '#888' }}>TOTAL SALES</ThemedText>
            </View>
            <View style={[styles.glassPlaceholder, { flex: 1, padding: 16 }]}>
              <ThemedText style={{ fontSize: 24, fontWeight: '900', color: '#4CAF50' }}>12</ThemedText>
              <ThemedText style={{ fontSize: 10, color: '#888' }}>ACTIVE ORDERS</ThemedText>
            </View>
          </View>

          <ThemedText type="subtitle" style={{ marginBottom: 16 }}>New Inquiries</ThemedText>
          {orders.filter(o => o.status === 'pending').map(order => (
            <View key={order.id} style={[styles.glassPlaceholder, { marginBottom: 12, alignItems: 'stretch' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View>
                  <ThemedText style={{ fontWeight: 'bold' }}>{order.customer}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: '#888' }}>{order.items}</ThemedText>
                </View>
                <ThemedText style={{ color: '#FFD700', fontWeight: 'bold' }}>{order.price}</ThemedText>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity 
                  onPress={() => handleAccept(order.id)}
                  style={{ flex: 1, backgroundColor: '#FFD700', padding: 12, borderRadius: 12, alignItems: 'center' }}
                >
                  <ThemedText style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Accept Order</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 12, alignItems: 'center' }}>
                  <ThemedText style={{ color: '#888', fontWeight: 'bold', fontSize: 12 }}>Decline</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <ThemedText type="subtitle" style={{ marginTop: 20, marginBottom: 16 }}>Delivery Status</ThemedText>
          <View style={styles.glassPlaceholder}>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(76,175,80,0.1)', padding: 10, borderRadius: 12 }}>
                <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
              </View>
              <View>
                <ThemedText style={{ fontWeight: 'bold' }}>Kit Dispatched</ThemedText>
                <ThemedText style={{ fontSize: 12, color: '#888' }}>Technician: Sumit Kumar picked up.</ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, { marginTop: 40, backgroundColor: '#333' }]} onPress={onBack}>
            <ThemedText style={[styles.buttonText, { color: '#FFD700' }]}>Exit Vendor Mode</ThemedText>
          </TouchableOpacity>
       </View>
    </ScrollView>
  );
}

// Full Operational Technician Dashboard
function TechnicianDashboard({ onBack }: { onBack: () => void }) {
  const [tasks, setTasks] = useState([
    { id: 'T1', type: 'Pickup', location: 'Tata Power Warehouse', status: 'pending', customer: 'Amit Sharma' },
    { id: 'T2', type: 'Install', location: 'Civil Lines, Kanpur', status: 'upcoming', customer: 'Rahul Verma' }
  ]);

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <LinearGradient colors={['#4CAF50', '#2E7D32']} style={{ height: 220, padding: 20, justifyContent: 'flex-end', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <ThemedText type="title" style={{ color: '#fff', fontSize: 32 }}>Field Ops</ThemedText>
              <ThemedText style={{ color: '#fff', opacity: 0.7, fontWeight: 'bold' }}>CERTIFIED INSTALLER</ThemedText>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 20 }}>
              <IconSymbol name="wrench.fill" size={32} color="#fff" />
            </View>
          </View>
       </LinearGradient>

       <View style={[styles.section, { marginTop: -30 }]}>
          <View style={{ backgroundColor: '#1A1A1A', borderRadius: 24, padding: 20, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#4CAF50' }}>
            <ThemedText style={{ color: '#4CAF50', fontSize: 10, fontWeight: '900', marginBottom: 4 }}>CURRENT STATUS</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>On Duty - Kanpur Sector 1</ThemedText>
          </View>

          <ThemedText type="subtitle" style={{ marginBottom: 16 }}>Today's Schedule</ThemedText>
          {tasks.map(task => (
            <View key={task.id} style={[styles.glassPlaceholder, { marginBottom: 16, alignItems: 'stretch' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View style={{ backgroundColor: task.status === 'completed' ? '#4CAF5020' : '#FF980020', padding: 8, borderRadius: 10 }}>
                    <IconSymbol name={task.type === 'Pickup' ? 'cart.fill' : 'wrench.fill'} size={20} color={task.status === 'completed' ? '#4CAF50' : '#FF9800'} />
                  </View>
                  <View>
                    <ThemedText style={{ fontWeight: 'bold' }}>{task.type}: {task.customer}</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: '#888' }}>{task.location}</ThemedText>
                  </View>
                </View>
                {task.status === 'completed' && <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />}
              </View>

              {task.status !== 'completed' && (
                <TouchableOpacity 
                  onPress={() => handleComplete(task.id)}
                  style={{ backgroundColor: '#4CAF50', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                >
                  <ThemedText style={{ color: '#fff', fontWeight: 'bold' }}>
                    {task.type === 'Pickup' ? 'Confirm Pickup' : 'Complete Installation'}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={[styles.glassPlaceholder, { marginTop: 10, borderStyle: 'dashed' }]}>
            <ThemedText style={{ color: '#888', fontSize: 12 }}>+ Job Confirmation requires Site Photos</ThemedText>
          </View>

          <TouchableOpacity style={[styles.button, { marginTop: 40, backgroundColor: '#333' }]} onPress={onBack}>
            <ThemedText style={[styles.buttonText, { color: '#4CAF50' }]}>Exit Field Mode</ThemedText>
          </TouchableOpacity>
       </View>
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
  }
});
