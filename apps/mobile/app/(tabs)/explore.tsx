import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductCard } from '@/components/solar/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { apiUrl } from '@/constants/api';

const CATEGORIES = ['All', 'Kits', 'Panels', 'Inverters', 'Eco-Home', 'Services'];

export default function MarketplaceScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching products, using mock');
        setProducts([
          { id: 101, title: 'Premium On-Grid Kit 5kW', price: 280000, category: 'Kits', vendor: 'Tata Power', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d' },
          { id: 102, title: 'Essential Hybrid Kit 3kW', price: 195000, category: 'Kits', vendor: 'Luminous', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d' },
          { id: 201, title: 'Monocrystalline Panel 550W', price: 18500, category: 'Panels', vendor: 'Waaree', rating: 4.7, image_url: 'https://images.unsplash.com/photo-1509391366360-fe5bb58583bb' },
          { id: 301, title: 'Smart Solar Inverter 5kVA', price: 52000, category: 'Inverters', vendor: 'Microtek', rating: 4.6, image_url: 'https://images.unsplash.com/photo-1558444479-c84851218670' }
        ]);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Marketplace</ThemedText>
        <TouchableOpacity style={styles.cartButton}>
          <IconSymbol name="cart" size={24} color={themeColors.text} />
          <View style={styles.cartBadge} />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryTab, 
                selectedCategory === item && { backgroundColor: '#FFD700' }
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === item && { color: '#000', fontWeight: 'bold' }
              ]}>
                {item}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      </View>

      {/* Product Grid */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFD700" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductCard product={item} />
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  cartButton: {
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  categoryText: {
    fontSize: 14,
  },
  productList: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
