import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card, Button, StatusBadge } from '@solar-hub/ui';

export function VendorTools() {
  return (
    <View style={styles.container}>
      {/* Storefront Management */}
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Storefront Manager</ThemedText>
        <Button 
          variant="primary" 
          onClick={() => console.log('Add product')}
          className="py-1 px-3 text-[10px]"
        >
          + ADD PRODUCT
        </Button>
      </View>
      
      <View style={styles.inventoryList}>
        <InventoryCard 
          name="Titan 5kW Kit" 
          stock={8} 
          price="₹2,85,000" 
          status="In Stock"
        />
        <InventoryCard 
          name="Luminous Hybrid" 
          stock={0} 
          price="₹1,95,000" 
          status="Out of Stock"
        />
      </View>

      {/* Lead CRM */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Lead CRM</ThemedText>
      <View style={styles.leadTabs}>
        <LeadTab label="New" count={5} active />
        <LeadTab label="Follow-up" count={12} />
        <LeadTab label="Converted" count={42} />
      </View>
      
      <View style={styles.leadList}>
        <LeadCard name="Vikram Singh" type="Residential" value="5kW" time="2h ago" />
        <LeadCard name="Modern Schools" type="Commercial" value="25kW" time="5h ago" />
      </View>

      {/* Business Intelligence */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Insights</ThemedText>
      <View style={styles.statsGrid}>
        <Card className="flex-1 bg-yellow-900/10 border-yellow-500/20">
          <ThemedText style={styles.statLabel}>Conversion Rate</ThemedText>
          <ThemedText style={styles.statValue}>24%</ThemedText>
          <ThemedText style={[styles.statChange, { color: '#4CAF50' }]}>+2.4% vs last mo</ThemedText>
        </Card>
        <Card className="flex-1 bg-yellow-900/10 border-yellow-500/20">
          <ThemedText style={styles.statLabel}>Avg. Order Value</ThemedText>
          <ThemedText style={styles.statValue}>₹2.1L</ThemedText>
          <ThemedText style={[styles.statChange, { color: '#FFA500' }]}>-5% vs last mo</ThemedText>
        </Card>
      </View>
    </View>
  );
}

function InventoryCard({ name, stock, price, status }: any) {
  const isOutOfStock = stock === 0;
  return (
    <Card className="p-4">
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={styles.prodThumb} />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.prodName}>{name}</ThemedText>
          <ThemedText style={styles.prodPrice}>{price}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <StatusBadge status={isOutOfStock ? 'FAILED' : 'ACTIVE'} />
            <ThemedText style={[styles.stockText, { color: isOutOfStock ? '#FF5252' : '#4CAF50' }]}>
              {status} ({stock})
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <IconSymbol name="pencil" size={16} color="#888" />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function LeadTab({ label, count, active }: any) {
  return (
    <TouchableOpacity style={[styles.leadTab, active && styles.leadTabActive]}>
      <ThemedText style={[styles.leadTabText, active && { color: '#000' }]}>{label}</ThemedText>
      <View style={[styles.leadBadge, active && { backgroundColor: '#000' }]}>
        <ThemedText style={[styles.leadBadgeText, active && { color: '#FFD700' }]}>{count}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

function LeadCard({ name, type, value, time }: any) {
  return (
    <Card className="flex-row items-center gap-3 p-3">
      <View style={styles.leadAvatar}>
        <ThemedText style={{ fontWeight: 'bold', color: '#FFD700' }}>{name[0]}</ThemedText>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.leadName}>{name}</ThemedText>
        <ThemedText style={styles.leadType}>{type} • {value}</ThemedText>
      </View>
      <ThemedText style={styles.leadTime}>{time}</ThemedText>
    </Card>
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  inventoryList: {
    gap: 12,
  },
  prodThumb: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 12,
  },
  prodName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  prodPrice: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '900',
    marginTop: 2,
  },
  stockText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  leadTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 10,
    borderRadius: 12,
  },
  leadTabActive: {
    backgroundColor: '#FFD700',
  },
  leadTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
  },
  leadBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  leadBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  leadList: {
    gap: 10,
  },
  leadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  leadType: {
    fontSize: 11,
    opacity: 0.5,
  },
  leadTime: {
    fontSize: 11,
    opacity: 0.4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  statChange: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  }
});
