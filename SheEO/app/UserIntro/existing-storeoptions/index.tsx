import React, { useState, useEffect, useRef, useLayoutEffect} from 'react';
import {ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Platform, Animated, Easing, LayoutAnimation, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { loadFonts, getFontFamily } from '../../../components/FontConfig';
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get('window');

const storeOptions = [
  { name: 'sari-sari', image: require('../../../assets/png/sari.png') },
  { name: 'gulayan', image: require('../../../assets/png/gulayan.png') },
  { name: 'bakery', image: require('../../../assets/png/bakery.png') },
  { name: 'foodstall', image: require('../../../assets/png/foodstall.png') },
  { name: 'butcher', image: require('../../../assets/png/butchery.png') },
];

interface ExistingStoreOptionsProps {
  fontsLoaded?: boolean;
}

const ExistingStoreOptions: React.FC<ExistingStoreOptionsProps> = ({ fontsLoaded = true }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [touched, setTouched] = useState<{storeName: boolean, location: boolean, store: boolean}>({storeName: false, location: false, store: false});

  
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const formAnimation = useRef(new Animated.Value(0)).current;
  const storeOptionsAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    const animations = [
      { animation: titleAnimation, delay: 0 },
      { animation: formAnimation, delay: 200 },
      { animation: storeOptionsAnimation, delay: 400 },
      { animation: buttonAnimation, delay: 600 },
    ];

    animations.forEach(({ animation, delay }) => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const isStoreNameValid = storeName.trim().length > 0;
  const isLocationValid = location.trim().length > 0;
  const isStoreValid = !!selectedStore;
  const isFormValid = isStoreNameValid && isLocationValid && isStoreValid;

  const handleStoreSelect = (storeName: string) => {
    setSelectedStore(storeName);
  };

  const handleConfirm = () => {
    setTouched({storeName: true, location: true, store: true});
    if (!isFormValid) return;
    router.push('/existing-inventory');
  };

  const renderStore = ({ item, index }: { item: typeof storeOptions[0], index: number }) => {
    const isSelected = selectedStore === item.name;
 
    const isLastInRow = (index + 1) % 3 === 0;
    return (
      <TouchableOpacity
        style={[
          styles.square,
          isSelected && styles.selectedSquare,
          isLastInRow && { marginRight: 0 },
        ]}
        onPress={() => handleStoreSelect(item.name)}
        activeOpacity={0.7}
      >
        <Image
          source={item.image}
          style={[
            styles.storeImage,
            isSelected && styles.selectedStoreImage
          ]}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.storeText,
            { fontFamily: getFontFamily(isSelected ? 'bold' : 'medium', fontsLoaded) },
            isSelected && styles.selectedText,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, overflow: 'visible' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
 <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <Animated.View style={{
          opacity: titleAnimation,
          transform: [{ translateY: titleAnimation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }]
        }}>
          <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            Let's get to know <Text style={[styles.titleAccent, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>your</Text> business!
          </Text>
        </Animated.View>

        <Animated.View style={{
          opacity: formAnimation,
          transform: [{ translateY: formAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
        }}>
          <Text style={[styles.label, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>Store Name</Text>
          <TextInput
            style={[styles.input, { fontFamily: getFontFamily('regular', fontsLoaded) }, !isStoreNameValid && touched.storeName && styles.inputError]}
            value={storeName}
            onChangeText={text => { setStoreName(text); if (!touched.storeName) setTouched(t => ({...t, storeName: true})); }}
            placeholder="Enter store name"
            placeholderTextColor="#666"
          />
        </Animated.View>

        <Animated.View style={{
          opacity: storeOptionsAnimation,
          transform: [{ translateY: storeOptionsAnimation.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
        }}>
          <Text style={[styles.label, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>What is your existing store?</Text>
          <View style={styles.optionsWrapper}>
            <FlatList
              key={'store-options-3'}
              data={storeOptions}
              renderItem={renderStore}
              keyExtractor={item => item.name}
              numColumns={3}
              contentContainerStyle={styles.storeOptions}
              columnWrapperStyle={{ justifyContent: 'flex-start' }}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={{ overflow: 'visible' }}
            />
            {!isStoreValid && touched.store && (
              <Text style={[styles.errorText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>Please select a store type.</Text>
            )}
          </View>
        </Animated.View>

        <Animated.View style={{
          opacity: formAnimation,
          transform: [{ translateY: formAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
        }}>
          <Text style={[styles.label, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>Location</Text>
          <TextInput
            style={[styles.input, { fontFamily: getFontFamily('regular', fontsLoaded) }, !isLocationValid && touched.location && styles.inputError]}
            value={location}
            onChangeText={text => { setLocation(text); if (!touched.location) setTouched(t => ({...t, location: true})); }}
            placeholder="Enter location"
            placeholderTextColor="#666"
          />
        </Animated.View>
        <Animated.View style={{
          opacity: buttonAnimation,
          transform: [{ translateY: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
        }}>
          <TouchableOpacity
            style={[styles.confirmButton, !isFormValid && styles.confirmButtonDisabled, { marginTop: 24 }]}
            onPress={handleConfirm}
            activeOpacity={isFormValid ? 0.7 : 1}
            disabled={!isFormValid}
          >
            <Text style={[styles.confirmButtonText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ExistingStoreOptions;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    flex: 1,
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 20,
    overflow: 'visible',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    backgroundColor: 'transparent',
    color: '#69006c',
    marginBottom: 18,
    letterSpacing: -1,
    textAlign: 'center',
  },
  titleAccent: {
    color: '#A259C6',
    fontWeight: '800',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
    marginLeft: 2,
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storeOptions: {
    marginBottom: 16,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'visible',
  },
  optionsWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 0,
    marginTop: 12,
    overflow: 'visible',
  },
  square: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
    marginRight: 12,
    width: (width - 2 * 20 - 2 * 12) / 3,
    height: Math.min(120, height * 0.16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    transform: [{ scale: 1 }],
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'visible',
  },
  selectedSquare: {
    borderColor: '#69006c',
    borderWidth: 2,
    backgroundColor: '#F7FAFC',
    transform: [{ scale: 1.08 }],
    shadowColor: '#69006c',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  storeImage: {
    width: '70%',
    height: '55%',
    marginBottom: 8,
    resizeMode: 'contain',
  },
  selectedStoreImage: {
    width: '82%',
    height: '65%',
  },
  storeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedText: {
    color: '#69006c',
    fontWeight: 'bold',
  },
  confirmButton: {
    marginBottom: 12,
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
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1a6e6',
  },
});
