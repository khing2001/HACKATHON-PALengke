import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { loadFonts, getFontFamily } from '../components/FontConfig';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        
        const fontSuccess = await loadFonts();
        setFontsLoaded(fontSuccess);

        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');

        setTimeout(() => {
          if (hasCompletedOnboarding === 'true') {

            router.replace('/(app)/main');
          } else {
            router.replace('/(first)/language');
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error initializing app:', error);
        router.replace('/(first)/language');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={[styles.loadingText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
          Loading PALengke...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.loadingText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
        Initializing...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4D0045',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
});
