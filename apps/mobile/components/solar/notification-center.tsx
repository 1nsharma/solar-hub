import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../themed-text';
import { IconSymbol } from '../ui/icon-symbol';
import { apiUrl } from '@/constants/api';

const { width, height } = Dimensions.get('window');

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'health' | 'finance' | 'system';
  created_at: string;
}

export function NotificationCenter({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(apiUrl('/api/notifications/u1'));
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return '#FFD700';
      case 'health': return '#4CAF50';
      case 'finance': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order': return 'cart.fill';
      case 'health': return 'bolt.fill';
      case 'finance': return 'creditcard.fill';
      default: return 'bell.fill';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <Animated.View entering={FadeInDown.springify()} exiting={FadeOutUp} style={styles.container}>
          <BlurView intensity={80} tint="dark" style={styles.blur}>
            <View style={styles.header}>
              <View>
                <ThemedText type="title" style={styles.title}>Notifications</ThemedText>
                <ThemedText style={styles.subtitle}>{notifications.length} Unread Updates</ThemedText>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
              {notifications.map((notif, idx) => (
                <Animated.View 
                  key={notif.id} 
                  entering={FadeInDown.delay(idx * 100)}
                  style={styles.notificationCard}
                >
                  <View style={[styles.iconContainer, { backgroundColor: getTypeColor(notif.type) + '15' }]}>
                    <IconSymbol name={getTypeIcon(notif.type) as any} size={20} color={getTypeColor(notif.type)} />
                  </View>
                  <View style={styles.content}>
                    <View style={styles.cardHeader}>
                      <ThemedText style={styles.notifTitle}>{notif.title}</ThemedText>
                      <ThemedText style={styles.time}>Just now</ThemedText>
                    </View>
                    <ThemedText style={styles.message}>{notif.message}</ThemedText>
                  </View>
                </Animated.View>
              ))}
              
              {notifications.length === 0 && !loading && (
                <View style={styles.emptyContainer}>
                  <IconSymbol name="bell.slash.fill" size={48} color="rgba(255,255,255,0.1)" />
                  <ThemedText style={styles.emptyText}>All caught up!</ThemedText>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              style={styles.markRead}
            >
              <ThemedText style={styles.markReadText}>MARK ALL AS READ</ThemedText>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.75,
    backgroundColor: 'rgba(26,26,26,0.9)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  blur: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: 'bold',
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
  },
  message: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 18,
  },
  markRead: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  markReadText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    gap: 16,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
