import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AdminTools } from './admin-tools';

const { width } = Dimensions.get('window');
const BENTO_SPACING = 12;

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
         colors={['#050505', '#1A237E']} 
         style={styles.header}
       >
          <View style={styles.navRow}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.profileBadge}>
              <View style={styles.onlineDot} />
              <ThemedText style={styles.profileText}>Super Admin</ThemedText>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.heroContent}>
            <ThemedText style={styles.overhead}>SYSTEM ROOT</ThemedText>
            <ThemedText type="title" style={styles.title}>Ops Center</ThemedText>
            <View style={styles.statusRow}>
               <IconSymbol name="shield.fill" size={16} color="#4CAF50" />
               <ThemedText style={styles.statusText}>ALL SYSTEMS OPERATIONAL</ThemedText>
            </View>
          </Animated.View>
       </LinearGradient>

       <View style={styles.bentoContainer}>
          <View style={styles.bentoRow}>
             <Animated.View entering={FadeInRight.delay(400)} style={[styles.bentoCard, styles.bentoHalf, { backgroundColor: '#1A237E' }]}>
                <ThemedText style={styles.bentoLabel}>TOTAL REVENUE</ThemedText>
                <ThemedText style={styles.bentoValue}>₹84.2L</ThemedText>
                <ThemedText style={styles.bentoSub}>+22% Growth</ThemedText>
             </Animated.View>
             <Animated.View entering={FadeInRight.delay(500)} style={[styles.bentoCard, styles.bentoHalf, { backgroundColor: '#1A1A1A' }]}>
                <ThemedText style={styles.bentoLabel}>ACTIVE USERS</ThemedText>
                <ThemedText style={styles.bentoValue}>1,240</ThemedText>
                <ThemedText style={styles.bentoSub}>84 Live Now</ThemedText>
             </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.pulseCard}>
             <View style={styles.pulseHeader}>
                <ThemedText style={styles.pulseTitle}>System Pulse</ThemedText>
                <View style={styles.liveTag}><ThemedText style={styles.liveTagText}>LIVE</ThemedText></View>
             </View>
             <PulseItem time="02:14 AM" event="New Vendor Application: SolarFlow" />
             <PulseItem time="02:08 AM" event="Order #8821 Milestone: Site Survey Done" />
             <PulseItem time="01:55 AM" event="Global Sync: 12.5 kWh Gen Reported" />
          </Animated.View>

          <ThemedText type="subtitle" style={styles.sectionHeader}>Administrative Tools</ThemedText>
          <AdminTools />
       </View>
       <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function PulseItem({ time, event }: { time: string; event: string }) {
  return (
    <View style={styles.pulseItem}>
      <ThemedText style={styles.pulseTime}>{time}</ThemedText>
      <ThemedText style={styles.pulseEvent}>{event}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  profileText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  overhead: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64B5F6',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: 'rgba(76,175,80,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  bentoContainer: {
    padding: 24,
    marginTop: -20,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: BENTO_SPACING,
    marginBottom: BENTO_SPACING,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bentoHalf: {
    aspectRatio: 1.1,
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bentoValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
  bentoSub: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 4,
  },
  pulseCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },
  pulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  liveTag: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveTagText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#fff',
  },
  pulseItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  pulseTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: 'bold',
    width: 60,
  },
  pulseEvent: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
  },
});
