import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';
import Products from './Products';
import ViewAnalyticsCard from './ViewAnalyticsCard';
import Analytics from './Analytics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SaleNotification from '../../components/SaleNotification';
import { addProduct, sellProduct, getProducts } from '../../lib/inventory';
import { Product } from '../../lib/inventory';

interface ShopProps {
  fontsLoaded?: boolean;
}

const Shop: React.FC<ShopProps> = ({ fontsLoaded = true }) => {
  const router = useRouter();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [notif, setNotif] = useState<{visible: boolean, name: string, amount?: number, qty: number, type: 'sale' | 'undo' | 'outOfStock'}>({visible: false, name: '', amount: 0, qty: 1, type: 'sale'});
  const [lastSale, setLastSale] = useState<{name: string, qty: number}>({name: '', qty: 1});


  useEffect(() => {
    const fetchProducts = async () => {
      const stored = await getProducts();
      setProducts(stored);
    };
    fetchProducts();
  }, []);

  const handleAnalyticsPress = () => {
    // TODO: Navigate to analytics screen
    console.log('Analytics pressed');
  };

  // Rename handler for clarity
  const handleUndo = () => {
    if (lastSale.name) {
      setNotif({ visible: true, name: lastSale.name, qty: lastSale.qty, type: 'undo' });
    }
  };

  const handleProductSale = async (product: Product, quantity: number, type: 'sale' | 'undo' | 'outOfStock' = 'sale') => {
    if (type === 'outOfStock') {
      setNotif({ visible: true, name: product.name, qty: 0, type: 'outOfStock' });
      return;
    }

    await sellProduct(product.id);  //update inventory
    const updated = await getProducts(); //fetch pinakalatest
    setProducts(updated); //update UI

    setNotif({ visible: true, name: product.name, amount: product.price, qty: quantity, type: 'sale' });
    setLastSale({ name: product.name, qty: quantity });
  };

  const handleHideNotif = () => {
    setNotif((n) => ({ ...n, visible: false }));
  };

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
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 32}}>
        {/* Menu Icon */}
        <View style={styles.menuIconWrapper}>
          <TouchableOpacity style={styles.menuIconBtn}>
            <Ionicons name="menu" size={44} color="#7B1FA2" />
          </TouchableOpacity>
        </View>

        {/* Products Card: header + grid as one card */}
        <View style={styles.productsCardContainer}>
          {/* Header (top corners rounded, deep purple) */}
          <View style={styles.productsHeaderCard}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>Products</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => router.push('/shop/EditProducts')}>
                <View style={styles.editBtnCircle}>
                  <Ionicons name="pencil-outline" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>One tap counts as one sale.</Text>
          </View>
          {/* Product grid (bottom corners rounded, lavender) */}
          <View style={styles.productsSectionWrapper}>
            <ScrollView style={{flex: 1, minHeight: 200, maxHeight: 550}} contentContainerStyle={{paddingBottom: 64}} showsVerticalScrollIndicator={false}>
              <Products products={products} fontsLoaded={fontsLoaded} onProductSale={handleProductSale} />
            </ScrollView>
            <TouchableOpacity style={styles.refreshBtn} onPress={handleUndo}>
              <Ionicons name="arrow-undo-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Analytics Card */}
        <View style={styles.analyticsCardWrapper}>
          <ViewAnalyticsCard onPress={() => setShowAnalytics(true)} fontsLoaded={fontsLoaded} gradient subtitle="Summary Statistics" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Shop;

const CARD_RADIUS = 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  menuIconWrapper: {
    marginTop: 48,
    marginBottom: 2,
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  menuIconBtn: {
    padding: 10,
    borderRadius: 22,
  },
  productsCardContainer: {
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginTop: 0,
  },
  productsHeaderCard: {
    backgroundColor: '#720877',
    paddingTop: 15,
    paddingBottom: 12,
    paddingHorizontal: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  title: {
    fontSize: 30,
    color: '#fff',
    letterSpacing: 0.2,
  },
  editBtn: {
    padding: 0,
    borderRadius: 20,
  },
  editBtnCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 0,
    marginTop: 2,
  },
  productsSectionWrapper: {
    backgroundColor: '#DBCFDF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 8,
    position: 'relative',
  },
  refreshBtn: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    backgroundColor: '#BF5DC8',
    borderRadius: 40,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  analyticsCardWrapper: {
    marginHorizontal: 7,
    justifyContent: 'center',
  },
});
