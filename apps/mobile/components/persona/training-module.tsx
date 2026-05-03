import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width, height } = Dimensions.get('window');

interface TrainingModuleProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TrainingModule({ visible, onClose, onComplete }: TrainingModuleProps) {
  const [step, setStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < 2) {
      setStep(step + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <LinearGradient colors={['#050505', '#1A1A1A']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 0 && styles.progressDotActive]} />
            <View style={[styles.progressLine, step >= 1 && styles.progressLineActive]} />
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          </View>
        </View>

        {step === 0 && (
          <Animated.View entering={FadeInDown} exiting={FadeOut} style={styles.content}>
            <View style={styles.videoPlaceholder}>
              <IconSymbol name="play.circle.fill" size={64} color="#FFD700" />
              <ThemedText style={styles.videoDuration}>04:15</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>Solar Safety & SOPs</ThemedText>
            <ThemedText style={styles.subtitle}>Micro-Course • Module 1</ThemedText>
            <ThemedText style={styles.body}>
              Before you step onto a roof, you must master the fundamental safety protocols. In this quick video, we cover harness utilization, electrical isolation, and the SolarHub Zero-Defect standard.
            </ThemedText>
            <View style={styles.keyTakeaways}>
              <Takeaway icon="shield.fill" text="Always use 3-point harness on sloped roofs." />
              <Takeaway icon="bolt.slash.fill" text="Isolate DC lines before connecting the inverter." />
              <Takeaway icon="checkmark.seal.fill" text="Upload proof of work for every milestone." />
            </View>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOut} style={styles.content}>
            <ThemedText style={styles.overhead}>GATE EXAM</ThemedText>
            <ThemedText type="title" style={styles.title}>Knowledge Check</ThemedText>
            <ThemedText style={styles.question}>
              What is the first step before connecting the solar panels to the hybrid inverter?
            </ThemedText>
            <View style={styles.optionsList}>
              <OptionItem 
                index={0} 
                text="Turn on the AC grid power to test." 
                selected={selectedAnswer === 0} 
                onPress={() => { setSelectedAnswer(0); Haptics.selectionAsync(); }} 
              />
              <OptionItem 
                index={1} 
                text="Isolate the DC lines and verify zero voltage." 
                selected={selectedAnswer === 1} 
                onPress={() => { setSelectedAnswer(1); Haptics.selectionAsync(); }} 
                isCorrect 
              />
              <OptionItem 
                index={2} 
                text="Mount the inverter to the wall." 
                selected={selectedAnswer === 2} 
                onPress={() => { setSelectedAnswer(2); Haptics.selectionAsync(); }} 
              />
            </View>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={SlideInDown} style={styles.successContent}>
            <View style={styles.badgeRing}>
              <IconSymbol name="checkmark.seal.fill" size={80} color="#FFD700" />
            </View>
            <ThemedText type="title" style={styles.successTitle}>Module Passed!</ThemedText>
            <ThemedText style={styles.successBody}>
              You have successfully completed the Safety SOPs module. You are one step closer to independent dispatch.
            </ThemedText>
            <View style={styles.rewardCard}>
              <IconSymbol name="star.fill" size={24} color="#FFD700" />
              <View>
                <ThemedText style={styles.rewardTitle}>+50 Trust Points</ThemedText>
                <ThemedText style={styles.rewardSub}>Added to your Technician Profile</ThemedText>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, (step === 1 && selectedAnswer === null) && styles.actionButtonDisabled]} 
            onPress={handleNext}
            disabled={step === 1 && selectedAnswer === null}
          >
            <ThemedText style={styles.actionButtonText}>
              {step === 0 ? 'CONTINUE TO EXAM' : step === 1 ? 'SUBMIT ANSWER' : 'BACK TO DASHBOARD'}
            </ThemedText>
            <IconSymbol name="arrow.right" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
}

function Takeaway({ icon, text }: any) {
  return (
    <View style={styles.takeawayItem}>
      <View style={styles.takeawayIconBox}>
        <IconSymbol name={icon} size={16} color="#FFD700" />
      </View>
      <ThemedText style={styles.takeawayText}>{text}</ThemedText>
    </View>
  );
}

function OptionItem({ index, text, selected, onPress, isCorrect }: any) {
  return (
    <TouchableOpacity 
      style={[styles.optionItem, selected && styles.optionItemSelected, selected && isCorrect && styles.optionItemCorrect]} 
      onPress={onPress}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <ThemedText style={[styles.optionText, selected && styles.optionTextSelected]}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressDotActive: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  progressLine: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressLineActive: {
    backgroundColor: '#FFD700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#121212',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
    marginBottom: 32,
  },
  keyTakeaways: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  takeawayIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeawayText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  overhead: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 20,
  },
  question: {
    fontSize: 22,
    color: '#fff',
    lineHeight: 32,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 40,
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 16,
  },
  optionItemSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.05)',
  },
  optionItemCorrect: {
    // We can add logic to highlight green if we want to show immediate feedback
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FFD700',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
  },
  optionTextSelected: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badgeRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
  },
  successBody: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    gap: 16,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  rewardSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },
});
