import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TechnicianTools } from './technician-tools';
import { apiUrl } from '@/constants/api';
import * as Haptics from 'expo-haptics';

interface TechnicianDashboardProps {
  onBack: () => void;
}

export function TechnicianDashboard({ onBack }: TechnicianDashboardProps) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    try {
      // In a real app, userId would come from context
      const res = await fetch(apiUrl('/api/bookings/u1'));
      const data = await res.json();
      
      if (data && Array.isArray(data)) {
        const mappedTasks = data.map(item => ({
          id: item.id.substring(0, 8).toUpperCase(),
          type: item.service_title || 'Service Task',
          customer: 'Solar Customer', // Assuming generic for now
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
      console.warn('Failed to fetch real tasks, falling back to mocks');
      setTasks([
        { id: 'JOB-902', type: 'Site Survey', customer: 'Amit Sharma', address: 'Plot 42, Civil Lines, Kanpur, UP', status: 'pending', priority: 'High', contact: '+91 98765 43210' },
        { id: 'JOB-895', type: 'System Debug', customer: 'Sun Heights Apts', address: 'Block C, Sector 12, Kanpur', status: 'upcoming', priority: 'Medium', contact: '+91 88776 65544' },
        { id: 'JOB-888', type: 'Installation', customer: 'Rahul Verma', address: 'H.No 12, Indira Nagar, Sector 14', status: 'upcoming', priority: 'High', contact: '+91 77665 54433' }
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
    setRefreshing(true);
    fetchTasks();
  };

  const handleComplete = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#64B5F6" />}
    >
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
            <TouchableOpacity onPress={onBack} style={styles.backButtonRound}>
              <IconSymbol name="chevron.left" size={20} color="#fff" />
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
       <View style={styles.section}>
         <ThemedText type="subtitle" style={{ marginBottom: 16 }}>Operational Tools</ThemedText>
         <TechnicianTools />
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
  techJobCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 28,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
