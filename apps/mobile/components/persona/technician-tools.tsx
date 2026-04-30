import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export function TechnicianTools() {
  return (
    <View style={styles.container}>
      {/* Training & Certifications */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Training & Certs</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trainingList}>
        <CertificationCard 
          title="Safety Pro" 
          issuer="MNRE" 
          progress={100} 
          icon="shield.fill" 
          color="#4CAF50" 
        />
        <CertificationCard 
          title="Grid Mastery" 
          issuer="Tata Power" 
          progress={65} 
          icon="bolt.fill" 
          color="#FFD700" 
        />
        <CertificationCard 
          title="Site Surveyor" 
          issuer="SolarHub" 
          progress={20} 
          icon="map.fill" 
          color="#2196F3" 
        />
      </ScrollView>

      {/* Digital Toolbox */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>Field Toolbox</ThemedText>
      <View style={styles.toolboxGrid}>
        <ToolItem icon="compass.fill" label="Orientation" sub="North Finder" color="#FF5252" />
        <ToolItem icon="skew" label="Tilt Meter" sub="32° Optimal" color="#FFD700" />
        <ToolItem icon="camera.fill" label="Site Photos" sub="Doc Upload" color="#2196F3" />
        <ToolItem icon="doc.text.fill" label="Checklist" sub="Safety First" color="#4CAF50" />
      </View>

      {/* Training Videos */}
      <ThemedText type="subtitle" style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Guides</ThemedText>
      <View style={styles.videoList}>
        <VideoCard title="Panel Mounting 101" duration="4:20" />
        <VideoCard title="Inverter Wiring Guide" duration="12:45" />
        <VideoCard title="Safety on Roofs" duration="5:10" />
      </View>
    </View>
  );
}

function CertificationCard({ title, issuer, progress, icon, color }: any) {
  return (
    <View style={styles.certCard}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <ThemedText style={styles.certTitle}>{title}</ThemedText>
      <ThemedText style={styles.certIssuer}>{issuer}</ThemedText>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
      </View>
      <ThemedText style={styles.progressText}>{progress === 100 ? 'Certified' : `${progress}% Done`}</ThemedText>
    </View>
  );
}

function ToolItem({ icon, label, sub, color }: any) {
  return (
    <TouchableOpacity style={styles.toolItem}>
      <View style={[styles.toolIcon, { backgroundColor: color + '10' }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <View>
        <ThemedText style={styles.toolLabel}>{label}</ThemedText>
        <ThemedText style={styles.toolSub}>{sub}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

function VideoCard({ title, duration }: any) {
  return (
    <TouchableOpacity style={styles.videoCard}>
      <View style={styles.videoThumb}>
        <IconSymbol name="play.fill" size={20} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.videoTitle}>{title}</ThemedText>
        <ThemedText style={styles.videoDuration}>{duration}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={16} color="#444" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  trainingList: {
    gap: 12,
  },
  certCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  certIssuer: {
    fontSize: 11,
    opacity: 0.5,
    marginBottom: 12,
  },
  progressBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    opacity: 0.7,
  },
  toolboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toolItem: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121212',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  toolSub: {
    fontSize: 10,
    opacity: 0.5,
  },
  videoList: {
    gap: 10,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 16,
  },
  videoThumb: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  videoDuration: {
    fontSize: 11,
    opacity: 0.5,
  }
});
