import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Product } from '@solar-hub/types';
import { StatusBadge } from '@solar-hub/ui';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProductCard({ product }: { product: Product }) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(interpolate(pressed.value, [0, 1], [1, 0.95], Extrapolation.CLAMP)) }
      ],
      opacity: withSpring(interpolate(pressed.value, [0, 1], [1, 0.9], Extrapolation.CLAMP)),
    };
  });

  const handlePressIn = () => {
    pressed.value = 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    pressed.value = 0;
  };

  return (
    <AnimatedPressable 
      style={[styles.container, animatedStyle, { backgroundColor: themeColors.card }]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']} 
        style={StyleSheet.absoluteFill} 
      />

      <View style={styles.badge}>
        <StatusBadge status="ACTIVE" className="bg-[#FFD700] text-black" />
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.vendor}>{product.vendor}</ThemedText>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
          {product.title}
        </ThemedText>
        
        <View style={styles.ratingRow}>
          <IconSymbol name="star.fill" size={10} color="#FFD700" />
          <ThemedText style={styles.rating}>{product.rating}</ThemedText>
          <View style={styles.dot} />
          <ThemedText style={styles.category}>{product.category}</ThemedText>
        </View>

        <View style={styles.footer}>
          <View>
            <ThemedText style={styles.priceLabel}>From</ThemedText>
            <ThemedText type="subtitle" style={styles.price}>
              ₹{product.price.toLocaleString()}
            </ThemedText>
          </View>
          <View style={styles.addButton}>
            <IconSymbol name="cart.fill" size={16} color="#000" />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  vendor: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '900',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  category: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '900',
  },
  addButton: {
    backgroundColor: '#FFD700',
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
