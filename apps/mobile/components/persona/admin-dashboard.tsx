import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminTools } from './admin-tools';
import * as Haptics from 'expo-haptics';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       <LinearGradient 
         colors={['#1A237E', '#0D47A1']} 
         style={{ height: 260, padding: 24, justifyContent: 'flex-end' }}
       >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <ThemedText style={{ color: '#64B5F6', fontSize: 12, fontWeight: '900', letterSpacing: 2 }}>OPERATIONS CENTER</ThemedText>
              <ThemedText type="title" style={{ color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 4 }}>System Root</ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' }} />
                <ThemedText style={{ color: '#4CAF50', fontSize: 12, fontWeight: 'bold' }}>All Services Normal</ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={handleBack} style={styles.backButtonRound}>
              <IconSymbol name="chevron.left" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <IconSymbol name="bell.fill" size={20} color="#FFD700" />
            <ThemedText style={{ color: '#fff', fontSize: 13 }}>2 Pending Vendor approvals require action</ThemedText>
          </View>
       </LinearGradient>

       <View style={styles.section}>
          <AdminTools />
       </View>
       <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  backButtonRound: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
