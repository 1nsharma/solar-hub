import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Product {
  id: string | number;
  title: string;
  price: number;
  category: string;
  vendor: string;
  rating: number;
  image_url: string;
  description: string;
}

export function ProductCard({ product }: { product: Product }) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#121212' : '#F5F5F5' }]}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <LinearGradient 
        colors={['transparent', 'rgba(0,0,0,0.8)']} 
        style={StyleSheet.absoluteFill} 
      />

      <View style={styles.badge}>
        <ThemedText style={styles.badgeText}>PREMIUM</ThemedText>
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
          <ThemedText type="subtitle" style={styles.price}>
            ₹{product.price.toLocaleString()}
          </ThemedText>
          <View style={styles.addButton}>
            <IconSymbol name="chevron.right" size={14} color="#000" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
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
  price: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  addButton: {
    backgroundColor: '#FFD700',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
