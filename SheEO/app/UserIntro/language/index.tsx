import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Animated, Easing, Dimensions, LayoutAnimation, UIManager, Platform } from 'react-native';
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

const t = {
  English: {
    title: 'Set Preferred Language:',
    confirm: 'Confirm',
  },
  Tagalog: {
    title: 'Itakda ang Gustong Wika:',
    confirm: 'Magpatuloy',
  },
  Bisaya: {
    title: 'Pislita ang Ganahan na Pinulongan:',
    confirm: 'Padayun',
  },
};

export default function LanguageScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<'English' | 'Tagalog' | 'Bisaya' | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const titleAnimation = useRef(new Animated.Value(0)).current;
  const buttonsAnimation = useRef(new Animated.Value(0)).current;
  const confirmAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadAppFonts = async () => {
      const success = await loadFonts();
      setFontsLoaded(success);
    };
    loadAppFonts();

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
    if (selectedLang) {
      Animated.timing(confirmAnimation, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      confirmAnimation.setValue(0);
    }
  }, [selectedLang]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleSelectLang = (lang: 'English' | 'Tagalog' | 'Bisaya') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setSelectedLang(lang);
  };

  const handleConfirm = async () => {
    if (selectedLang) {
      await AsyncStorage.setItem('preferredLanguage', selectedLang);
      router.push('/onboarding');
    }
  };

  const currentText = t[selectedLang || 'English'];

  return (
    <ImageBackground
      source={require('../../../assets/png/woven-bg.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <BlurView intensity={10} tint="light" style={styles.blurBox}>
        <View>
          <Animated.View style={{ opacity: titleAnimation, transform: [{ translateY: titleAnimation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>{currentText.title}</Text>
            </View>
          </Animated.View>
          <Animated.View style={{ opacity: buttonsAnimation, transform: [{ translateY: buttonsAnimation.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
            <View style={styles.squareWrapper}>
              {(['English', 'Tagalog', 'Bisaya'] as const).map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.button, styles.square, selectedLang === lang && styles.selected]}
                  onPress={() => handleSelectLang(lang)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.text,
                      { fontFamily: getFontFamily(selectedLang === lang ? 'bold' : 'regular', fontsLoaded) },
                      selectedLang === lang && styles.selectedText,
                    ]}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
        {selectedLang && (
          <Animated.View style={[styles.confirmButtonWrapper, { opacity: confirmAnimation, transform: [{ scale: confirmAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
            <TouchableOpacity style={[styles.button, styles.confirmSquare]} onPress={handleConfirm} activeOpacity={0.7}>
              <Text style={[styles.confirmText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>{currentText.confirm}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
    maxWidth: 500,
    maxHeight: 800,
    alignItems: 'center',
    justifyContent: 'space-around',
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
  titleContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  squareWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: 280,
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
  confirmButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  confirmSquare: {
    backgroundColor: '#ba6ada',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
});

