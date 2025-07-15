import { getFontFamily } from '../../../components/FontConfig';
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { View as RNView } from 'react-native';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  hasImage?: boolean;
}

interface ProductsProps {
  products: Product[];
  fontsLoaded?: boolean;
  onProductSale?: (product: Product, quantity: number, type?: 'sale' | 'undo' | 'outOfStock', position?: { x: number; y: number }) => void;
}

const Products: React.FC<ProductsProps> = ({ products, fontsLoaded = true, onProductSale }) => {
  const productRefs = useRef<{ [key: string]: React.RefObject<any> }>({});

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

    // Get the position of the tapped product
    if (productRefs.current[product.id] && productRefs.current[product.id]!.current && onProductSale) {
      (productRefs.current[product.id]!.current as any).measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        const position = {
          x: pageX + width / 2, // Center horizontally
          y: pageY + height / 2  // Center vertically
        };
        onProductSale(product, 1, 'sale', position);
      });
    } else if (onProductSale) {
      // Fallback if measurement fails
      onProductSale(product, 1, 'sale');
    }
  };

  // Calculate responsive dimensions
  const cardWidth = Math.max(100, (width - 2 * 40 - 2 * 20) / 3); // 20px padding on each side, 12px gap between cards
  const imageSize = Math.max(48, cardWidth * 0.55);
  const cardHeight = Math.max(140, cardWidth * 1.45);

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((product, colIndex) => {
            const isLastInRow = colIndex === 2;
            return (
              <TouchableOpacity
                key={product.id}
                ref={ref => {
                  if (!productRefs.current[product.id]) {
                    productRefs.current[product.id] = React.createRef<any>();
                  }
                  productRefs.current[product.id].current = ref as any;
                }}
                style={[
                  styles.card,
                  { width: cardWidth, height: cardHeight },
                  product.stock <= 0 && styles.outOfStockCard,
                  !isLastInRow && { marginRight: 12 },
                  // Remove marginRight for last card in row
                ]}
                onPress={() => handleProductPress(product)}
                activeOpacity={0.75}
              >
                <View style={styles.cardContent}>
                  <Text style={[styles.price, { fontFamily: getFontFamily('bold', fontsLoaded), fontSize: Math.min(18, cardWidth * 0.15) }]}>
                    {`₱${product.price.toFixed(2)}`}
                  </Text>
                  {product.hasImage ? (
                    <View style={[styles.imagePlaceholder, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }]} />
                  ) : (
                    <View style={[styles.imagePlaceholderEmpty, { width: imageSize * 0.6, height: imageSize * 0.6, borderRadius: imageSize * 0.3 }]} />
                  )}
                  <Text style={[styles.name, { fontFamily: getFontFamily('medium', fontsLoaded), fontSize: Math.min(14, cardWidth * 0.12) }]}>
                    {product.name.toLowerCase()}
                  </Text>
                  <View style={[styles.stockContainer, { backgroundColor: product.stock > 0 ? '#E8F5E8' : '#FFE8E8' }]}>
                    <Text style={[styles.stock, {
                      fontFamily: getFontFamily('medium', fontsLoaded),
                      fontSize: Math.min(11, cardWidth * 0.09),
                      color: product.stock > 0 ? '#2E7D32' : '#C62828'
                    }]}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          {/* Fill empty spots for last row if needed */}
          {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
            <View key={`empty-${i}`} style={[styles.card, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, width: cardWidth, height: cardHeight }]} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    paddingHorizontal: 8, // Left and right margins are now equal and consistent
    paddingBottom: 20, // Add more bottom padding
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16, // Reduced from 20 for tighter spacing
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    // marginHorizontal removed for consistent left alignment
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(74, 21, 75, 0.05)',
  },
  outOfStockCard: {
    borderWidth: 2,
    borderColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOpacity: 0.15,
  },
  cardContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  price: {
    color: '#4A154B',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  imagePlaceholder: {
    backgroundColor: '#E3F2FD',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  imagePlaceholderEmpty: {
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  name: {
    color: '#2C2C2C',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'capitalize',
    textAlign: 'center',
    lineHeight: 18,
  },
  stockContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
  },
  stock: {
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 10,
  },
});

export default Products;
