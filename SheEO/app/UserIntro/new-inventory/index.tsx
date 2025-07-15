import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, TextInput, Platform, Animated, Easing, LayoutAnimation, UIManager } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { loadFonts, getFontFamily } from '../../../components/FontConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { width, height } = Dimensions.get('window');

function GradientText({ text, style }: { text: string, style?: any }) {
  return (
    <Text style={[style, { color: '#69006C' }]}>{text}</Text>
  );
}

interface Product {
  id: string;
  name: string;
  pcs: number;
  cost: number;
  price: number;
  image: any;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'tempura',
    pcs: 100,
    cost: 10,
    price: 12,
    image: require('../../../assets/png/fishball.png'),
  },
];

export default function ExistingInventoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<null | (Product & { pcsStr: string; costStr: string; priceStr: string })>(null);
  const [newProduct, setNewProduct] = useState<null | (Product & { pcsStr: string; costStr: string; priceStr: string })>(null);
  const [capital, setCapital] = useState(1000);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const bottomAnimation = useRef(new Animated.Value(0)).current;

 
  const [scrollY, setScrollY] = useState(0);
  const [contentHeight, setContentHeight] = useState(1);
  const [containerHeight, setContainerHeight] = useState(1);

  useEffect(() => {
    const loadAppFonts = async () => {
      const success = await loadFonts();
      setFontsLoaded(success);
    };
    loadAppFonts();

    
    Animated.stagger(200, [
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bottomAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEdit = (product: Product) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setEditingProduct({
      ...product,
      pcsStr: product.pcs.toString(),
      costStr: product.cost.toString(),
      priceStr: product.price.toString(),
    });
  };

  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = (product: Product & { pcsStr: string; costStr: string; priceStr: string }) => {
    
    if (!product.name.trim() || !product.pcsStr.trim() || !product.costStr.trim() || !product.priceStr.trim()) {
      return; 
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setProducts(products.map(p =>
      (p.id === product.id ? {
        ...product,
        pcs: Number(product.pcsStr) || 0,
        cost: Number(product.costStr) || 0,
        price: Number(product.priceStr) || 0,
      } : p)
    ));
    setEditingProduct(null);
  };

  const handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setEditingProduct(null);
  };

  const handleAdd = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setNewProduct({
      id: (Math.random() * 100000).toFixed(0),
      name: '',
      pcs: 0,
      cost: 0,
      price: 0,
      image: require('../../../assets/png/fishball.png'),
      pcsStr: '',
      costStr: '',
      priceStr: '',
    });
  };

  const handleSaveNew = () => {
    if (newProduct) {
      if (!newProduct.name.trim() || !newProduct.pcsStr.trim() || !newProduct.costStr.trim() || !newProduct.priceStr.trim()) {
        return; 
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setProducts([
        ...products,
        {
          ...newProduct,
          pcs: Number(newProduct.pcsStr) || 0,
          cost: Number(newProduct.costStr) || 0,
          price: Number(newProduct.priceStr) || 0,
        },
      ]);
      setNewProduct(null);
    }
  };

  const handleCancelNew = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setNewProduct(null);
  };

  const isFieldEmpty = (value: string) => !value || !value.trim();

  const getInputStyle = (value: string, baseStyle: any) => [
    baseStyle,
    isFieldEmpty(value) ? { borderColor: '#EF4444', borderWidth: 2 } : {}
  ];

  const scrollbarMargin = 20;
  const scrollbarHeight = 100;
  const maxScroll = contentHeight - containerHeight;
  let rawTop = maxScroll > 0 ? (scrollY / maxScroll) * (containerHeight - scrollbarHeight - 2 * scrollbarMargin) : 0;
  rawTop = Math.max(0, Math.min(rawTop, containerHeight - scrollbarHeight - 2 * scrollbarMargin));
  const scrollbarTop = scrollbarMargin + rawTop;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={{
        opacity: headerAnimation,
        transform: [{ translateY: headerAnimation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
      }}>
        {/* Removed back button */}
        <GradientText text="Edit suggestions!" style={[styles.title, { paddingHorizontal: 20 }]} />
        <Text style={[styles.subheading, { fontFamily: getFontFamily('regular', fontsLoaded), paddingHorizontal: 20 }]}>Let's perfect your business ideas:.</Text>
      </Animated.View>

      {/* Content */}
      <Animated.View style={[styles.blurBox, {
        opacity: contentAnimation,
        transform: [{ translateY: contentAnimation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
      }]}>
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          onScroll={e => setScrollY(e.nativeEvent.contentOffset.y)}
          onContentSizeChange={(w, h) => setContentHeight(h)}
          onLayout={e => setContainerHeight(e.nativeEvent.layout.height)}
          scrollEventThrottle={16}
        >
          {products.map((product) =>
            editingProduct && editingProduct.id === product.id ? (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.editTopRow}>
                  <View style={styles.editImageCircle}>
                    <Image source={require('../../../assets/png/addimgbtn.png')} style={{ width: 21, height: 21, tintColor: 'black' }} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.editLabel}>product name</Text>
                    <TextInput
                      style={getInputStyle(editingProduct.name, styles.editNameInput)}
                      value={editingProduct.name}
                      onChangeText={v => setEditingProduct({ ...editingProduct, name: v })}
                      placeholder="Product name"
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>
                <View style={styles.editFieldsRow}>
                  <View style={styles.editFieldBox}>
                    <Text style={styles.editFieldLabel}>pcs</Text>
                    <TextInput
                      style={getInputStyle(editingProduct.pcsStr, styles.editFieldInput)}
                      value={editingProduct.pcsStr}
                      onChangeText={v => setEditingProduct({ ...editingProduct, pcsStr: v.replace(/[^0-9]/g, '') })}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.editFieldBox}>
                    <Text style={styles.editFieldLabel}>cost</Text>
                    <View style={{ position: 'relative', width: '100%' }}>
                      <View style={styles.editPesoBox}><Text style={styles.editPeso}>P</Text></View>
                      <TextInput
                        style={getInputStyle(editingProduct.costStr, [styles.editFieldInput, { paddingLeft: 24 }])}
                        value={editingProduct.costStr}
                        onChangeText={v => setEditingProduct({ ...editingProduct, costStr: v.replace(/[^0-9.]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  <View style={styles.editFieldBox}>
                    <Text style={styles.editFieldLabel}>price</Text>
                    <View style={{ position: 'relative', width: '100%' }}>
                      <View style={styles.editPesoBox}><Text style={styles.editPeso}>P</Text></View>
                      <TextInput
                        style={getInputStyle(editingProduct.priceStr, [styles.editFieldInput, { paddingLeft: 24 }])}
                        value={editingProduct.priceStr}
                        onChangeText={v => setEditingProduct({ ...editingProduct, priceStr: v.replace(/[^0-9.]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.editActionsRow}>
                  <TouchableOpacity
                    style={[styles.deleteIcon, { backgroundColor: 'transparent', padding: 0 }]}
                    onPress={() => {
                      setPendingDeleteId(product.id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <Image source={require('../../../assets/png/deletebtn.png')} style={{ width: 32, height: 32 }} />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => handleSave(editingProduct)}>
                      <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productRow}>
                  <View style={styles.productImageCircle} />
                  <View style={styles.productInfoStack}>
                    <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">{product.name}</Text>
                    <Text style={styles.productPcs}>{product.pcs} pcs</Text>
                  </View>
                  <View style={styles.productDetailsEditRow}>
                    <View style={styles.productDetailsStack}>
                      <Text style={styles.productInfoGray}>cost: P{product.cost.toFixed(2)}</Text>
                      <Text style={styles.productInfoGray}>total cost: P{(product.pcs * product.cost).toFixed(2)}</Text>
                      <Text style={styles.productInfoGray}>price/pc: P{product.price.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity style={styles.editIconImg} onPress={() => handleEdit(product)}>
                      <Image source={require('../../../assets/png/editbtn.png')} style={styles.editImg} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )
          )}
          {newProduct && (
            <View style={styles.productCard}>
              <View style={styles.editTopRow}>
                <View style={styles.editImageCircle}>
                  <Image source={require('../../../assets/png/addimgbtn.png')} style={{ width: 21, height: 21, tintColor: 'black' }} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.editLabel}>product name</Text>
                  <TextInput
                    style={getInputStyle(newProduct.name, styles.editNameInput)}
                    value={newProduct.name}
                    onChangeText={v => setNewProduct({ ...newProduct, name: v })}
                    placeholder="Product name"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>
              <View style={styles.editFieldsRow}>
                <View style={styles.editFieldBox}>
                  <Text style={styles.editFieldLabel}>pcs</Text>
                  <TextInput
                    style={getInputStyle(newProduct.pcsStr, styles.editFieldInput)}
                    value={newProduct.pcsStr}
                    onChangeText={v => setNewProduct({ ...newProduct, pcsStr: v.replace(/[^0-9]/g, '') })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.editFieldBox}>
                  <Text style={styles.editFieldLabel}>cost</Text>
                  <View style={{ position: 'relative', width: '100%' }}>
                    <View style={styles.editPesoBox}><Text style={styles.editPeso}>P</Text></View>
                    <TextInput
                      style={getInputStyle(newProduct.costStr, [styles.editFieldInput, { paddingLeft: 24 }])}
                      value={newProduct.costStr}
                      onChangeText={v => setNewProduct({ ...newProduct, costStr: v.replace(/[^0-9.]/g, '') })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={styles.editFieldBox}>
                  <Text style={styles.editFieldLabel}>price</Text>
                  <View style={{ position: 'relative', width: '100%' }}>
                    <View style={styles.editPesoBox}><Text style={styles.editPeso}>P</Text></View>
                    <TextInput
                      style={getInputStyle(newProduct.priceStr, [styles.editFieldInput, { paddingLeft: 24 }])}
                      value={newProduct.priceStr}
                      onChangeText={v => setNewProduct({ ...newProduct, priceStr: v.replace(/[^0-9.]/g, '') })}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>
              <View style={styles.editActionsRow}>
                <TouchableOpacity style={[styles.deleteIcon, { backgroundColor: 'transparent', padding: 0 }]} onPress={handleCancelNew}>
                  <Image source={require('../../../assets/png/deletebtn.png')} style={{ width: 32, height: 32 }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelNew}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSaveNew}>
                    <Text style={styles.saveBtnText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
        {/* Custom Scrollbar Overlay */}
        <View pointerEvents="none" style={[styles.scrollWheel, { height: scrollbarHeight, top: scrollbarTop }]}>
          <Image
            source={require('../../../assets/png/scrollbar.png')}
            style={{ width: '100%', height: '100%', resizeMode: 'stretch' }}
          />
        </View>
      </Animated.View>

      {/* Bottom row and confirm button remain unchanged */}
      <Animated.View style={{
        opacity: bottomAnimation,
        transform: [{ translateY: bottomAnimation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
      }}>
        <View style={styles.bottomRow}>
          <Text style={styles.capitalText}>Capital: P{capital.toLocaleString()}</Text>
          <View style={styles.fabRow}>
            <TouchableOpacity style={styles.fabBtn} onPress={handleAdd}>
              <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fabBtn}>
              <Text style={styles.fabIcon}>📸</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={async () => {
            await AsyncStorage.setItem('onboardingCompleted', 'true');
            router.replace('/(app)/main');
          }}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </Animated.View>
      {showDeleteModal && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirm Delete</Text>
              <Text style={styles.modalText}>
                Are you sure you want to delete {products.find(p => p.id === pendingDeleteId)?.name || 'this item'}?
              </Text>
              <Text style={styles.modalNote}>This action is irreversible.</Text>
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDeleteBtn}
                  onPress={() => {
                    if (pendingDeleteId) handleDelete(pendingDeleteId);
                    setShowDeleteModal(false);
                    setPendingDeleteId(null);
                    setEditingProduct(null);
                  }}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: '2%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backArrow: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    padding: 8,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: Math.min(width * 0.08, 32),
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#69006c',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subheading: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#4A5568',
    marginBottom: 24,
    lineHeight: 22,
  },
  blurBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flex: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  scrollArea: {
    flex: 1,
    paddingTop: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
    lineHeight: 22,
  },
  productPcs: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
    lineHeight: 18,
  },
  productDetailsStack: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
    marginLeft: 'auto',
  },
  productDetailsEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 100,
  },
  productCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#69006c',
    textAlign: 'right',
  },
  productPrice: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'right',
    marginTop: 2,
  },
  productInfoGray: {
    fontSize: 13,
    color: '#718096',
    textAlign: 'right',
    marginBottom: 2,
    lineHeight: 16,
  },
  editIconImg: {
    alignSelf: 'center',
    marginLeft: 8,
    padding: 4,
  },
  editImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  editCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
    padding: 20,
  },
  editTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  editImageCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editLabel: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
    marginBottom: 8,
  },
  editNameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#69006c',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editFieldsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  editFieldBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  editFieldLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 6,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  editFieldInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#69006c',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 60,
    width: '100%',
  },
  editPesoBox: {
    position: 'absolute',
    left: 8,
    top: 8,
    bottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  editPeso: {
    fontSize: 16,
    color: '#69006c',
    fontWeight: '600',
  },
  editActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#69006c',
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginRight: 12,
  },
  cancelBtnText: {
    color: '#69006c',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: '#69006c',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  capitalText: {
    color: '#2D3748',
    fontSize: 16,
    fontWeight: '600',
  },
  fabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fabBtn: {
    backgroundColor: '#F7FAFC',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fabIcon: {
    fontSize: 24,
    color: '#69006c',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#69006c',
    borderRadius: 24,
    width: '90%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#69006c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  productInfoStack: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 1,
  },
  scrollWheel: {
    position: 'absolute',
    right: 0,
    width: 20,
    resizeMode: 'stretch',
    zIndex: 10,
  },
  deleteIcon: {
    padding: 8,
    borderRadius: 8,
  },
  confirmButton: {
    marginTop: 24,
    marginBottom: 24,
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#69006c',
    borderRadius: 28,
    width: '80%',
    maxWidth: 280,
    shadowColor: '#69006c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A259C6',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalNote: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#A259C6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalDeleteBtn: {
    flex: 1,
    backgroundColor: '#A259C6',
    borderRadius: 12,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
