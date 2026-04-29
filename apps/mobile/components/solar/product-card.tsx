import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    <TouchableOpacity style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.badge}>
        <ThemedText style={styles.badgeText}>Free Installation</ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.vendor}>{product.vendor}</ThemedText>
        <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
          {product.title}
        </ThemedText>
        
        <View style={styles.ratingRow}>
          <IconSymbol name="star.fill" size={12} color="#FFD700" />
          <ThemedText style={styles.rating}>{product.rating}</ThemedText>
          <View style={styles.dot} />
          <ThemedText style={styles.category}>{product.category}</ThemedText>
        </View>

        <View style={styles.footer}>
          <View>
            <ThemedText style={styles.priceLabel}>Starting from</ThemedText>
            <ThemedText type="subtitle" style={styles.price}>
              ₹{product.price.toLocaleString()}
            </ThemedText>
          </View>
          
          <TouchableOpacity style={styles.addButton}>
            <IconSymbol name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  vendor: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  category: {
    fontSize: 12,
    opacity: 0.6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    opacity: 0.6,
  },
  price: {
    fontSize: 18,
    color: '#FFD700',
  },
  addButton: {
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
