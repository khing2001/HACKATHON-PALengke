import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, StyleSheet, Animated, Easing, Dimensions, LayoutAnimation, UIManager, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { loadFonts, getFontFamily } from '../../../components/FontConfig';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const { height } = Dimensions.get('window');

const t = {
  English: {
    title: 'Start by choosing your path:',
    option1: 'I already have a business',
    option2: 'I want to start a business',
    confirm: 'Confirm',
  },
  Tagalog: {
    title: 'Simulan sa pagpili ng iyong landas:',
    option1: 'May negosyo na ako',
    option2: 'Nais kong magsimula ng negosyo',
    confirm: 'Magpatuloy',
  },
  Bisaya: {
    title: 'Sugdi pinaagi sa pagpili sa imong dalan:',
    option1: 'Naa koy negosyo',
    option2: 'Gusto kong magsugod og negosyo',
    confirm: 'Padayon',
  },
};

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [lang, setLang] = useState<'English' | 'Tagalog' | 'Bisaya'>('English');
  const [selected, setSelected] = useState<'option1' | 'option2' | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Animation refs
  const imageAnimation = useRef(new Animated.Value(0)).current;
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const buttonsAnimation = useRef(new Animated.Value(0)).current;
  const confirmAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadAppFonts = async () => {
      const success = await loadFonts();
      setFontsLoaded(success);
    };
    loadAppFonts();

    const getLang = async () => {
      const storedLang = await AsyncStorage.getItem('preferredLanguage');
      if (storedLang === 'Tagalog' || storedLang === 'Bisaya') {
        setLang(storedLang);
      }
    };
    getLang();

    Animated.stagger(200, [
      Animated.timing(titleAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnimation, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    const isOptionSelected = selected !== null;
    Animated.timing(imageAnimation, {
      toValue: isOptionSelected ? 1 : 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    if (isOptionSelected) {
      Animated.timing(confirmAnimation, {
        toValue: 1,
        duration: 400,
        delay: 200, // Stagger confirm button
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      confirmAnimation.setValue(0);
    }
  }, [selected]);


  const handleSelectOption = (option: 'option1' | 'option2') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelected(option);
  };

  const text = t[lang];

  const handleConfirm = () => {
    if (selected === 'option1') {
      router.push('/existing-storeoptions');
    } else if (selected === 'option2') {
      router.push('/new-storeoptions');
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);


  return (
    <ImageBackground
      source={require('../../../assets/png/woven-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <BlurView intensity={10} tint="light" style={styles.blurBox}>
        {selected && (
          <Animated.View style={[styles.imageWrapper, { opacity: imageAnimation, transform: [{ scale: imageAnimation }] }]}>
            <Image
              source={
                selected === 'option1'
                  ? require('../../../assets/png/onbrd-op1.png')
                  : require('../../../assets/png/onbrd-op2.png')
              }
              style={styles.optionImage}
              resizeMode="contain"
            />
          </Animated.View>
        )}
        <Animated.View style={{ opacity: titleAnimation, transform: [{ translateY: titleAnimation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
          <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>{text.title}</Text>
        </Animated.View>
        <Animated.View style={[styles.squareWrapper, selected && styles.moveDown, { opacity: buttonsAnimation, transform: [{ translateY: buttonsAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <TouchableOpacity
            style={[styles.button, styles.square, selected === 'option1' && styles.selected]}
            onPress={() => handleSelectOption('option1')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.text,
              { fontFamily: getFontFamily(selected === 'option1' ? 'bold' : 'regular', fontsLoaded) },
              selected === 'option1' && styles.selectedText
            ]}>
              {text.option1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.square, selected === 'option2' && styles.selected]}
            onPress={() => handleSelectOption('option2')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.text,
              { fontFamily: getFontFamily(selected === 'option2' ? 'bold' : 'regular', fontsLoaded) },
              selected === 'option2' && styles.selectedText
            ]}>
              {text.option2}
            </Text>
          </TouchableOpacity>
          {selected && (
            <Animated.View style={[styles.confirmButtonWrapper, { opacity: confirmAnimation, transform: [{ scale: confirmAnimation }] }]}>
              <TouchableOpacity style={[styles.button, styles.confirmSquare]} onPress={handleConfirm} activeOpacity={0.7}>
                <Text style={[styles.confirmText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>{text.confirm}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBox: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    width: '90%',
    height: '90%',
    maxWidth: 500, // Max width for tablet sizes
    maxHeight: 800, // Max height for tablet sizes
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 20,
    shadowColor: '#AD001D',
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  squareWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  moveDown: {
    marginTop: 20,
  },
  button: {
    width: '90%',
    height: 60,
    borderRadius: 278,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  square: {
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  selected: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#F3E5F5',
  },
  selectedText: {
    color: '#69006c',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  confirmButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  confirmSquare: {
    backgroundColor: '#ba6ada',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
});

