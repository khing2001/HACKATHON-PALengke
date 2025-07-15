import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, Text, LogBox, BackHandler, Modal, TouchableOpacity, Animated, Easing } from 'react-native';
import { db } from "../../../firebase/firebaseConfig";
import BottomNavbar from "../../../components/BottomNavbar";
import { loadFonts, getFontFamily } from "../../../components/FontConfig";
import Home from "../home";
import Shop from "../shop";
import Chat from "../chat";
import Wallet from "../wallet";
import SharePage from "../share";
import Resources from "../resources";
import Analytics from "../shop/Analytics";
import EditProducts from "../shop/EditProducts";
import SideMenu from "../../../components/SideMenu";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

LogBox.ignoreLogs(['Warning: Invalid prop `style` supplied to `React.Fragment`']);

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('main'); 
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontLoadingComplete, setFontLoadingComplete] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  
  const [products] = useState([
    { id: '1', name: 'tempura', price: 10.0, stock: 0, hasImage: true },
    { id: '2', name: 'fishballs', price: 10.0, stock: 0, hasImage: true },
    { id: '3', name: 'kwek-kwek', price: 10.0, stock: 100, hasImage: true },
    { id: '4', name: 'tempura', price: 0.0, stock: 100, hasImage: true },
    { id: '5', name: 'fishballs', price: 30.0, stock: 100, hasImage: true },
    { id: '6', name: 'kwek-kwek', price: 100.0, stock: 100, hasImage: true },
  ]);

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        const success = await loadFonts();
        setFontsLoaded(success);
        setFontLoadingComplete(true);
        console.log('Font loading result:', success);
      } catch (error) {
        console.log('Error loading fonts:', error);
        setFontsLoaded(false);
        setFontLoadingComplete(true);
      }
    };

    loadAppFonts();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'main') {
        setShowExitModal(true);
        Animated.timing(modalAnimation, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
        return true; 
      }
      return false; 
    });

    return () => backHandler.remove();
  }, [currentScreen, modalAnimation]);

  const handleExitApp = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowExitModal(false);
      BackHandler.exitApp();
    });
  };

  const handleCancelExit = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowExitModal(false);
    });
  };

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const closeMenu = () => setIsMenuVisible(false);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    setCurrentScreen('main'); 
  };

  const navigateToShare = () => {
    setCurrentScreen('share');
  };

  const navigateToResources = () => {
    setCurrentScreen('resources');
  };

  const navigateToAnalytics = () => {
    setCurrentScreen('analytics');
  };

  const navigateToEditProducts = () => {
    setCurrentScreen('editProducts');
  };

  const navigateBack = () => {
    setCurrentScreen('main');
  };

  const renderContent = () => {

    if (currentScreen === 'share') {
      return <SharePage fontsLoaded={fontsLoaded} onBack={navigateBack} />;
    }

    if (currentScreen === 'resources') {
      return <Resources fontsLoaded={fontsLoaded} onBack={navigateBack} />;
    }

    if (currentScreen === 'analytics') {
      return <Analytics onBack={navigateBack} />;
    }

    if (currentScreen === 'editProducts') {
      return <EditProducts onBack={navigateBack} />;
    }

    const props = {
      fontsLoaded,
      onNavigateToShare: navigateToShare,
      onNavigateToResources: navigateToResources,
      onNavigateToAnalytics: navigateToAnalytics,
      onNavigateToEditProducts: navigateToEditProducts,
      toggleMenu: toggleMenu, 
    };

    switch (activeTab) {
      case 'home':
        return <Home {...props} />;
      case 'shop':
        return <Shop {...props} />;
      case 'chat':
        return <Chat {...props} />;
      case 'wallet':
        return <Wallet />;
      default:
        return <Home {...props} />;
    }
  };

  if (!fontLoadingComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        {renderContent()}
        {currentScreen === 'main' && (
          <BottomNavbar activeTab={activeTab} onTabPress={handleTabPress} fontsLoaded={fontsLoaded} products={products} />
        )}
      </View>
      <SideMenu
        isVisible={isMenuVisible}
        onClose={closeMenu}
        fontsLoaded={fontsLoaded}
        onNavigateToResources={navigateToResources}
        onNavigateToAnalytics={navigateToAnalytics}
      />

      {/* Exit Confirmation Modal */}
      <Modal
        visible={showExitModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleCancelExit}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalAnimation,
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8FAFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              {/* Icon */}
              <View style={styles.modalIconContainer}>
                <LinearGradient
                  colors={['#4D0045', '#7B2D6B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalIconGradient}
                >
                  <Ionicons name="exit-outline" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>

              {/* Title */}
              <Text style={[styles.modalTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                Exit PALengke?
              </Text>

              {/* Message */}
              <Text style={[styles.modalMessage, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                Are you sure you want to close the app? Your progress will be saved.
              </Text>

              {/* Buttons */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelExit}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.cancelButtonText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                    Stay
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.exitButton}
                  onPress={handleExitApp}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4D0045', '#7B2D6B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.exitButtonGradient}
                  >
                    <Text style={[styles.exitButtonText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      Exit App
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontFamily: getFontFamily('regular', false),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  modalContent: {
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 24,
    color: '#4D0045',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#4D0045',
  },
  exitButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exitButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
