import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TechnicianTools } from './technician-tools';
import { apiUrl } from '@/constants/api';

const { width } = Dimensions.get('window');
const BENTO_SPACING = 12;

interface TechnicianDashboardProps {
  onBack: () => void;
}

export function TechnicianDashboard({ onBack }: TechnicianDashboardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(apiUrl('/api/bookings/u1'));
      const data = await res.json();
      
      if (data && Array.isArray(data)) {
        const mappedTasks = data.map(item => ({
          id: item.id.substring(0, 8).toUpperCase(),
          type: item.service_title || 'Service Task',
          customer: 'Solar Customer',
          address: 'User Address',
          status: item.status,
          priority: Math.random() > 0.5 ? 'High' : 'Medium',
          contact: '+91 98765 43210'
        }));
        setTasks(mappedTasks);
      } else {
        throw new Error('Invalid data');
      }
    } catch (err) {
      setTasks([
        { id: 'JOB-902', type: 'Site Survey', customer: 'Amit Sharma', address: 'Plot 42, Civil Lines, Kanpur, UP', status: 'pending', priority: 'High', contact: '+91 98765 43210', time: '10:30 AM' },
        { id: 'JOB-895', type: 'System Debug', customer: 'Sun Heights Apts', address: 'Block C, Sector 12, Kanpur', status: 'upcoming', priority: 'Medium', contact: '+91 88776 65544', time: '02:00 PM' },
        { id: 'JOB-888', type: 'Installation', customer: 'Rahul Verma', address: 'H.No 12, Indira Nagar, Sector 14', status: 'upcoming', priority: 'High', contact: '+91 77665 54433', time: '04:30 PM' }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchTasks();
  };

  const handleComplete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFD700" />}
    >
       <LinearGradient 
         colors={['#050505', '#1A1A1A']} 
         style={styles.header}
       >
          <View style={styles.navRow}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onBack();
              }} 
              style={styles.backButton}
            >
              <IconSymbol name="chevron.left" size={20} color="#FFD700" />
            </TouchableOpacity>
            <View style={styles.profileBadge}>
              <View style={styles.onlineDot} />
              <ThemedText style={styles.profileText}>Sumit (Technician)</ThemedText>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.heroContent}>
            <ThemedText style={styles.overhead}>FIELD OPERATIONS</ThemedText>
            <ThemedText type="title" style={styles.title}>Installer Pro</ThemedText>
            <View style={styles.statRow}>
               <StatItem label="JOBS TODAY" value="03" />
               <View style={styles.vDivider} />
               <StatItem label="RATING" value="4.9" />
               <View style={styles.vDivider} />
               <StatItem label="EARNINGS" value="₹2,450" />
            </View>
          </Animated.View>
       </LinearGradient>

       <View style={styles.bentoContainer}>
          {/* Main Bento Card: Next Job */}
          <Animated.View entering={FadeInDown.delay(400)} style={[styles.bentoCard, styles.bentoFull, { backgroundColor: '#FFD700' }]}>
             <View style={styles.bentoHeader}>
                <ThemedText style={[styles.bentoLabel, { color: '#000' }]}>NEXT APPOINTMENT</ThemedText>
                <View style={styles.timeBadge}>
                   <ThemedText style={styles.timeText}>{tasks[0]?.time || '10:30 AM'}</ThemedText>
                </View>
             </View>
             <ThemedText style={styles.bentoTitleDark}>{tasks[0]?.type}</ThemedText>
             <ThemedText style={styles.bentoSubtitleDark}>{tasks[0]?.customer} • {tasks[0]?.address}</ThemedText>
             <TouchableOpacity 
               onPress={() => {
                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                 handleComplete(tasks[0]?.id);
               }}
               style={styles.bentoButtonDark}
             >
                <ThemedText style={styles.buttonTextDark}>START NAVIGATION</ThemedText>
                <IconSymbol name="location.fill" size={16} color="#fff" />
             </TouchableOpacity>
          </Animated.View>

          {/* Secondary Bento Cards */}
          <View style={styles.bentoRow}>
             <Animated.View entering={FadeInRight.delay(600)} style={[styles.bentoCard, styles.bentoHalf, { backgroundColor: '#1A1A1A' }]}>
                <IconSymbol name="wrench.fill" size={24} color="#FFD700" />
                <ThemedText style={styles.bentoTitleSmall}>Inventory</ThemedText>
                <ThemedText style={styles.bentoLabelSmall}>87% Stocked</ThemedText>
             </Animated.View>
             <Animated.View entering={FadeInRight.delay(700)} style={[styles.bentoCard, styles.bentoHalf, { backgroundColor: '#1A1A1A' }]}>
                <IconSymbol name="shield.fill" size={24} color="#4CAF50" />
                <ThemedText style={styles.bentoTitleSmall}>Safety</ThemedText>
                <ThemedText style={styles.bentoLabelSmall}>Certified</ThemedText>
             </Animated.View>
          </View>

          {/* Workflow Section: NEW ADVANCED FEATURE */}
          <View style={[styles.section, { marginTop: 20 }]}>
            <View style={styles.sectionHeader}>
               <ThemedText type="subtitle">Current Job Progress</ThemedText>
               <ThemedText style={styles.percentage}>65%</ThemedText>
            </View>
            <View style={styles.progressBarBg}>
               <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>

            <View style={styles.checklist}>
               <ChecklistItem label="Safety Harness Verified" completed={true} />
               <ChecklistItem label="Roof Anchoring (8/12)" completed={true} />
               <ChecklistItem label="Panel Mounting" completed={false} />
               <ChecklistItem label="Inverter & DC Wiring" completed={false} />
            </View>

            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            >
               <IconSymbol name="camera.fill" size={20} color="#000" />
               <ThemedText style={styles.uploadText}>UPLOAD PROOF OF WORK</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText type="subtitle" style={styles.sectionHeader}>Remaining Schedule</ThemedText>
          
          {tasks.slice(1).map((task, idx) => (
            <Animated.View 
              key={task.id} 
              entering={FadeInDown.delay(800 + (idx * 100))}
              style={styles.taskListItem}
            >
               <View style={styles.taskListIcon}>
                  <IconSymbol name="calendar" size={20} color="#FFD700" />
               </View>
               <View style={{ flex: 1 }}>
                  <ThemedText style={styles.taskType}>{task.type}</ThemedText>
                  <ThemedText style={styles.taskMeta}>{task.customer} • {task.time}</ThemedText>
               </View>
               <TouchableOpacity style={styles.taskAction}>
                  <IconSymbol name="chevron.right" size={16} color="rgba(255,255,255,0.3)" />
               </TouchableOpacity>
            </Animated.View>
          ))}
       </View>

       <View style={styles.section}>
         <ThemedText type="subtitle" style={{ marginBottom: 16 }}>Operational Tools</ThemedText>
         <TechnicianTools />
       </View>
       
       <View style={{ height: 120 }} />
    </ScrollView>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

function ChecklistItem({ label, completed }: { label: string; completed: boolean }) {
  return (
    <View style={styles.checklistItem}>
      <View style={[styles.checkCircle, completed && { backgroundColor: '#4CAF50' }]}>
        {completed && <IconSymbol name="checkmark" size={12} color="#000" />}
      </View>
      <ThemedText style={[styles.checklistLabel, completed && { opacity: 0.4 }]}>{label}</ThemedText>
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
    color: '#FFD700',
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  statRow: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 24,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bentoContainer: {
    padding: 24,
    marginTop: -20,
  },
  bentoCard: {
    borderRadius: 32,
    padding: 24,
    marginBottom: BENTO_SPACING,
  },
  bentoFull: {
    width: '100%',
  },
  bentoRow: {
    flexDirection: 'row',
    gap: BENTO_SPACING,
    marginBottom: 24,
  },
  bentoHalf: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  bentoTitleDark: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
  },
  bentoSubtitleDark: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 24,
  },
  bentoButtonDark: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  buttonTextDark: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  bentoTitleSmall: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  bentoLabelSmall: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.4)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFD700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
    marginBottom: 24,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  checklist: {
    gap: 16,
    marginBottom: 24,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#FFD700',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  uploadText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  taskListIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  taskType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  taskMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  taskAction: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 12,
  },
});
