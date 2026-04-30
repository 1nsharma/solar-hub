import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { VendorTools } from './vendor-tools';
import { apiUrl } from '@/constants/api';
import * as Haptics from 'expo-haptics';

interface VendorDashboardProps {
  onBack: () => void;
}

export function VendorDashboard({ onBack }: VendorDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      // For demo purposes, we'll try to fetch leads for a mock partner ID
      // In a real app, this partner ID would come from the auth context
      const res = await fetch(apiUrl('/api/leads/vendor_mock_1'));
      const data = await res.json();
      
      if (data && Array.isArray(data)) {
        // Map backend leads to the UI order format
        const mappedOrders = data.map(item => ({
          id: item.id.substring(0, 8).toUpperCase(),
          customer: item.customer_name || item.name,
          items: item.requirement || 'Solar Inquiry',
          status: item.status,
          price: '₹' + (Math.floor(Math.random() * 500000) + 100000).toLocaleString('en-IN'),
          location: item.pincode || 'Inquiry Location',
          date: new Date(item.created_at).toLocaleDateString()
        }));
        setOrders(mappedOrders);
      } else {
        throw new Error('Invalid data');
      }
    } catch (err) {
      console.warn('Failed to fetch real orders, falling back to mocks');
      setOrders([
        { id: 'ORD-7721', customer: 'Amit Sharma', items: '5kW Tata Solar Kit + Smart Inverter', status: 'pending', price: '₹2,85,000', location: 'Civil Lines, Kanpur', date: 'Today, 10:30 AM' },
        { id: 'ORD-7690', customer: 'Rahul Verma', items: '3kW Luminous Hybrid (Battery Incl.)', status: 'accepted', price: '₹1,95,000', location: 'Indira Nagar, Lucknow', date: 'Yesterday, 04:15 PM' },
        { id: 'ORD-7688', customer: 'Sita Devi', items: '10kW Commercial Array (Bifacial)', status: 'dispatched', price: '₹6,40,000', location: 'Gomti Nagar, Lucknow', date: '28 Apr, 2026' }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAccept = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'accepted' } : o));
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
    >
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
            <TouchableOpacity onPress={onBack} style={styles.backButtonRound}>
              <IconSymbol name="chevron.left" size={20} color="#fff" />
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

          {/* NEW ADVANCED FEATURE: Market Opportunities (Bidding System) */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <View style={styles.sectionHeader}>
               <ThemedText type="subtitle">Market Opportunities</ThemedText>
               <View style={styles.liveBadge}>
                  <View style={styles.pulseDot} />
                  <ThemedText style={styles.liveText}>8 LIVE LEADS</ThemedText>
               </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
               <LeadCard 
                  name="Vijay Malviya" 
                  load="5.5 kW" 
                  location="Indira Nagar, Sector 14" 
                  bids={3} 
                  onBid={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)} 
               />
               <LeadCard 
                  name="S.K. Enterprises" 
                  load="12 kW" 
                  location="Industrial Area, Phase II" 
                  bids={7} 
                  onBid={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)} 
               />
            </ScrollView>
          </View>

          <ThemedText type="subtitle" style={{ marginTop: 24, marginBottom: 16 }}>Business Tools</ThemedText>
          <VendorTools />
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

function LeadCard({ name, load, location, bids, onBid }: { name: string; load: string; location: string; bids: number; onBid: () => void }) {
  return (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View>
          <ThemedText style={styles.leadName}>{name}</ThemedText>
          <ThemedText style={styles.leadMeta}>{location}</ThemedText>
        </View>
        <View style={styles.loadBadge}>
          <ThemedText style={styles.loadText}>{load}</ThemedText>
        </View>
      </View>
      
      <View style={styles.bidSection}>
        <View>
          <ThemedText style={styles.bidCount}>{bids} Bids</ThemedText>
          <ThemedText style={styles.bidSub}>Active Competition</ThemedText>
        </View>
        <TouchableOpacity style={styles.bidButton} onPress={onBid}>
          <ThemedText style={styles.bidButtonText}>SUBMIT QUOTE</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonRound: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vendorOrderCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 20,
    borderRadius: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,82,82,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5252',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF5252',
    letterSpacing: 1,
  },
  leadCard: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  leadName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  leadMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  loadBadge: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loadText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFD700',
  },
  bidSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  bidCount: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  },
  bidSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
    marginTop: 2,
  },
  bidButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bidButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
});
