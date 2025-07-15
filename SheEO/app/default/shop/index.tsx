import { getFontFamily } from '../../../components/FontConfig';
import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native';
import Products from './Products';
import ViewAnalyticsCard from './ViewAnalyticsCard';
import Analytics from './Analytics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SaleNotification from '../../../components/SaleNotification';
import SideMenu from '../../../components/SideMenu';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ShopProps {
  fontsLoaded?: boolean;
  onNavigateToResources?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToEditProducts?: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  hasImage?: boolean;
}

interface ProductStack {
  [productId: string]: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalAmount: number;
  };
}

interface StackIndicatorData {
  position: { x: number; y: number };
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
}

const Shop: React.FC<ShopProps> = ({ fontsLoaded = true, onNavigateToResources, onNavigateToAnalytics, onNavigateToEditProducts }) => {
  const router = useRouter();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [products] = useState<Product[]>([
    { id: '1', name: 'tempura', price: 10.0, stock: 0, hasImage: true },
    { id: '2', name: 'fishballs', price: 10.0, stock: 0, hasImage: true },
    { id: '3', name: 'kwek-kwek', price: 10.0, stock: 100, hasImage: true },
    { id: '4', name: 'tempura', price: 0.0, stock: 100, hasImage: true },
    { id: '5', name: 'fishballs', price: 30.0, stock: 100, hasImage: true },
    { id: '6', name: 'kwek-kwek', price: 100.0, stock: 100, hasImage: true },
    { id: '7', name: 'isaw', price: 5.0, stock: 75, hasImage: true },
    { id: '8', name: 'banana cue', price: 8.0, stock: 50, hasImage: true },
    { id: '9', name: 'taho', price: 15.0, stock: 25, hasImage: true },
    { id: '10', name: 'ice candy', price: 3.0, stock: 80, hasImage: true },
    { id: '11', name: 'turon', price: 12.0, stock: 60, hasImage: true },
    { id: '12', name: 'balut', price: 20.0, stock: 30, hasImage: true },
    { id: '13', name: 'buko juice', price: 25.0, stock: 40, hasImage: true },
    { id: '14', name: 'mais', price: 18.0, stock: 35, hasImage: true },
    { id: '15', name: 'puto', price: 6.0, stock: 90, hasImage: true },
  ]);
  const [notif, setNotif] = useState<{visible: boolean, name: string, amount?: number, qty: number, type: 'sale' | 'undo' | 'outOfStock', items?: {name: string, quantity: number, amount: number}[] | undefined}>({visible: false, name: '', amount: 0, qty: 1, type: 'sale'});
  const [lastSale, setLastSale] = useState<{name: string, qty: number, amount?: number, items?: {name: string, quantity: number, amount: number}[]}>({name: '', qty: 1});

  // Enhanced stacking system state
  const [currentStack, setCurrentStack] = useState<ProductStack>({});
  const [stackIndicator, setStackIndicator] = useState<StackIndicatorData | null>(null);
  const stackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const STACK_TIMEOUT = 1500; // 1.5 seconds before showing accumulated result

  // Custom scrollbar state for products grid
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  // Calculate scrollbar height and position
  const scrollbarMargin = 20;
  const scrollbarHeight = 100;
  const maxScroll = contentHeight - containerHeight;
  let rawTop = maxScroll > 0 ? (scrollY / maxScroll) * (containerHeight - scrollbarHeight - 2 * scrollbarMargin) : 0;
  rawTop = Math.max(0, Math.min(rawTop, containerHeight - scrollbarHeight - 2 * scrollbarMargin));
  const scrollbarTop = scrollbarMargin + rawTop;

  const toggleMenu = () => {
    setSideMenuVisible(!isSideMenuVisible);
  };

  const handleAnalyticsPress = () => {
    // TODO: Navigate to analytics screen
    console.log('Analytics pressed');
  };

  // Clear any existing timeout and reset stack
  const clearStackTimeout = useCallback(() => {
    if (stackTimeoutRef.current) {
      clearTimeout(stackTimeoutRef.current);
      stackTimeoutRef.current = null;
    }
  }, []);

  // Enhanced handler for product sales with multi-product stacking
  const handleProductSale = useCallback((product: Product, quantity: number = 1, type: 'sale' | 'undo' | 'outOfStock' = 'sale', position?: { x: number; y: number }) => {
    // Handle out of stock - show notification but don't cancel stacking
    if (type === 'outOfStock') {
      // Don't clear current stacks - just show the notification
      setNotif({ visible: true, name: product.name, qty: 0, type: 'outOfStock' });
      return;
    }

    // Handle undo immediately (clear pending stacks first)
    if (type === 'undo') {
      clearStackTimeout();
      setCurrentStack({});
      setStackIndicator(null);
      setNotif({ visible: true, name: product.name, qty: quantity, type: 'undo' });
      return;
    }

    // Handle stacking for sales
    if (type === 'sale' && position) {
      clearStackTimeout();

      // Calculate the new stack state
      let updatedStack = { ...currentStack };

      if (updatedStack[product.id]) {
        // Product already in stack - add to it
        updatedStack[product.id] = {
          ...updatedStack[product.id],
          quantity: updatedStack[product.id].quantity + quantity,
          totalAmount: updatedStack[product.id].totalAmount + (product.price * quantity)
        };
      } else {
        // New product - add to stack
        updatedStack[product.id] = {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: quantity,
          totalAmount: product.price * quantity
        };
      }

      // Update the stack state
      setCurrentStack(updatedStack);

      // Update indicator for the current product using the new values
      const currentProductStack = updatedStack[product.id];
      setStackIndicator({
        position,
        productId: product.id,
        productName: product.name,
        quantity: currentProductStack.quantity,
        totalAmount: currentProductStack.totalAmount
      });

      // Set new timeout with the updated stack
      stackTimeoutRef.current = setTimeout(() => {
        // Use the updated stack for final confirmation
        const stackEntries = Object.values(updatedStack);
        if (stackEntries.length === 0) return;

        // Calculate totals
        const totalQuantity = stackEntries.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = stackEntries.reduce((sum, item) => sum + item.totalAmount, 0);

        // Create description for multiple products and pass detailed items
        let productName;
        let items = undefined;

        if (stackEntries.length === 1) {
          productName = stackEntries[0].productName;
        } else {
          productName = `${stackEntries.length} items`;
          // Pass detailed items for multi-product display
          items = stackEntries.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            amount: item.totalAmount
          }));
        }

        setNotif({
          visible: true,
          name: productName,
          amount: totalAmount,
          qty: totalQuantity,
          type: 'sale',
          items: items // Pass the detailed items array
        });

        // Set last sale to the combined order with detailed info
        setLastSale({
          name: productName,
          qty: totalQuantity,
          amount: totalAmount,
          items: items
        });

        // Reset stacks
        setCurrentStack({});
        setStackIndicator(null);
      }, STACK_TIMEOUT);
    }
  }, [currentStack, clearStackTimeout]);

  // Enhanced undo handler that shows detailed breakdown for multi-item sales
  const handleUndo = () => {
    // Always clear any pending stacks first
    clearStackTimeout();
    setCurrentStack({});
    setStackIndicator(null);

    if (lastSale.name) {
      setNotif({
        visible: true,
        name: lastSale.name,
        qty: lastSale.qty,
        amount: lastSale.amount,
        type: 'undo',
        items: lastSale.items
      });
    }
  };

  const handleHideNotif = () => {
    setNotif((n) => ({ ...n, visible: false }));
  };

  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      clearStackTimeout();
    };
  }, [clearStackTimeout]);

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <SaleNotification
        visible={notif.visible}
        productName={notif.name}
        amount={notif.amount}
        quantity={notif.qty}
        onHide={handleHideNotif}
        type={notif.type}
        items={notif.items}
      />

      {/* Show current stack indicator positioned dynamically */}
      {stackIndicator && (
        <View style={[styles.dynamicStackIndicator, {
          left: stackIndicator.position.x - 40, // Center the indicator
          top: stackIndicator.position.y - 30,  // Position above the product
        }]}>
          <Text style={[styles.stackQuantity, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            x{stackIndicator.quantity}
          </Text>
          <Text style={[styles.stackAmount, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
            ₱{stackIndicator.totalAmount.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Show total order indicator if multiple products */}
      {Object.keys(currentStack).length > 1 && (
        <View style={styles.totalOrderIndicator}>
          <Text style={[styles.totalOrderText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            {Object.keys(currentStack).length} items • ₱{Object.values(currentStack).reduce((sum, item) => sum + item.totalAmount, 0).toFixed(2)}
          </Text>
        </View>
      )}

      {/* Side Menu */}
      <SideMenu
        isVisible={isSideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
        fontsLoaded={fontsLoaded}
        onNavigateToResources={onNavigateToResources}
        onNavigateToAnalytics={onNavigateToAnalytics}
      />

      {/* Header with Menu Icon */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="#4A154B" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>Sales</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Products Card: header + grid as one card */}
      <View style={styles.productsCardContainer}>
        {/* Header with gradient */}
        <LinearGradient
          colors={['#4A154B', '#5A1F5B', '#6A2A6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.productsHeaderCard}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>Products</Text>
              <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>One tap counts as one sale.</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={onNavigateToEditProducts || (() => router.push('/shop/EditProducts'))}>
              <View style={styles.editBtnCircle}>
                <Ionicons name="pencil-outline" size={18} color="#4A154B" />
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Product grid */}
        <View style={styles.productsSectionWrapper}>
          <ScrollView
            style={styles.productsScrollView}
            contentContainerStyle={styles.productsScrollContent}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
            onContentSizeChange={(w, h) => setContentHeight(h)}
            onLayout={e => setContainerHeight(e.nativeEvent.layout.height)}
            scrollEventThrottle={16}
          >
            <Products products={products} fontsLoaded={fontsLoaded} onProductSale={handleProductSale} />
          </ScrollView>
          {/* Custom Scrollbar Overlay */}
          <View pointerEvents="none" style={[styles.scrollWheel, { height: scrollbarHeight, top: scrollbarTop }]}>
            <Image
              source={require('../../../assets/png/scrollbar.png')}
              style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
            />
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={handleUndo}>
            <LinearGradient
              colors={['#6A2A6B', '#4A154B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.refreshBtnGradient}
            >
              <Ionicons name="arrow-undo-outline" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Analytics Card */}
      <View style={styles.analyticsCardWrapper}>
        <ViewAnalyticsCard onPress={() => setShowAnalytics(true)} fontsLoaded={fontsLoaded} gradient subtitle="Summary Statistics" />
      </View>
    </SafeAreaView>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  menuButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 21, 75, 0.08)',
  },
  productsCardContainer: {
    marginHorizontal: 8, // Left and right margins are now equal and consistent
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    flex: 1,
    maxHeight: 500, // Set a fixed maximum height for the container
  },
  productsHeaderCard: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  editBtn: {
    padding: 4,
  },
  editBtnCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: -0.2,
  },
  productsSectionWrapper: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 8, // Left and right margins are now equal and consistent
    position: 'relative',
    flex: 1,
    height: 400, // Set a fixed height for the scrollable area
  },
  refreshBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    width: 56,
    height: 56,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  refreshBtnGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyticsCardWrapper: {
    marginHorizontal: 8, // Left and right margins are now equal and consistent
    paddingBottom: 40, // Add bottom padding for safe area
  },
  // New dynamic stack indicator styles
  dynamicStackIndicator: {
    position: 'absolute',
    backgroundColor: 'rgba(74, 21, 75, 0.95)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    zIndex: 1000,
    alignItems: 'center',
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  stackQuantity: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 18,
  },
  stackAmount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    lineHeight: 14,
  },
  totalOrderIndicator: {
    position: 'absolute',
    top: 100, // Adjust as needed to position it above the products grid
    right: 20,
    backgroundColor: 'rgba(74, 21, 75, 0.9)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    zIndex: 999,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  totalOrderText: {
    fontSize: 14,
    color: '#fff',
    letterSpacing: -0.2,
  },
  productsScrollView: {
    flex: 1,
  },
  productsScrollContent: {
    paddingBottom: 80, // Add padding at the bottom for the refresh button
  },
  scrollWheel: {
    position: 'absolute',
    right: 0,
    width: 20,
    resizeMode: 'stretch',
    zIndex: 10,
  },
});
