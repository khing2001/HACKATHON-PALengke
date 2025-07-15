import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';
import { Product } from '../../lib/inventory';

interface ProductsProps {
  products: Product[];
  fontsLoaded?: boolean;
  onProductSale?: (product: Product, quantity: number, type?: 'sale' | 'undo' | 'outOfStock') => void;
}

const Products: React.FC<ProductsProps> = ({ products, fontsLoaded = true, onProductSale }) => {
  // Arrange products in rows of 3
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  const handleProductPress = (product: Product) => {
    if (product.stock <= 0) {
      if (onProductSale) {
        onProductSale(product, 0, 'outOfStock');
      }
      return;
    }
    if (onProductSale) {
      onProductSale(product, 1, 'sale');
    }
  };

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.card}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.85}
            >
              <View style={styles.cardContent}>
                <Text style={[styles.price, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>{`₱${product.price}`}</Text>
                {product.image ? (
                  <View style={styles.imagePlaceholder} />
                ) : (
                  <View style={styles.imagePlaceholderEmpty} />
                )}
                <Text style={[styles.name, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>{product.name.toLowerCase()}</Text>
                <Text style={[styles.stock, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>stock: {product.stock}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* Fill empty spots for last row if needed */}
          {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
            <View key={`empty-${i}`} style={[styles.card, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />
          ))}
        </View>
      ))}
    </View>
  );
};

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    flex: 1,
    marginHorizontal: 5,
    minWidth: 120,
    maxWidth: 120,
    minHeight: 170,
    paddingVertical: 18,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  price: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#D1C4E9',
    marginBottom: 14,
  },
  imagePlaceholderEmpty: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  name: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'lowercase',
    textAlign: 'center',
  },
  stock: {
    fontSize: 12,
    color: '#444',
    marginTop: 0,
    textAlign: 'center',
  },
});

export default Products;