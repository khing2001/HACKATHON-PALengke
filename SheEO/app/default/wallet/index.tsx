import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFontFamily } from '../../../components/FontConfig';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import WalletModal from '../../../components/WalletModal';
import { useNavigation } from '@react-navigation/native';
import SideMenu from '../../../components/SideMenu';

interface WalletProps {
  fontsLoaded?: boolean;
  onNavigateToShare?: () => void;
  toggleMenu?: () => void;
}

const WalletScreen = () => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();

  // Animation refs
  const cardAnimation = useRef(new Animated.Value(0)).current;
  const transferAnimation = useRef(new Animated.Value(0)).current;
  const qrButtonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      { animation: cardAnimation, delay: 200 },
      { animation: transferAnimation, delay: 400 },
      { animation: qrButtonAnimation, delay: 600 },
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


  const toggleMenu = () => {
    setSideMenuVisible(!isSideMenuVisible);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="#4D0045" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Wallet Balance Card */}
        <Animated.View style={[styles.walletCard, {
            opacity: cardAnimation,
            transform: [{
              translateY: cardAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })
            }]
          }]}>
          <Text style={[styles.walletTitle, { fontFamily: getFontFamily('medium', true) }]}>
            <Text style={styles.walletTitleHighlight}>pa</Text>lengke wallet
          </Text>
          <Text style={[styles.walletBalance, { fontFamily: getFontFamily('bold', true) }]}>
            ₱00.00
          </Text>
        </Animated.View>

        {/* Transfer Options */}
        <Animated.View style={[styles.transferContainer, {
            opacity: transferAnimation,
            transform: [{
              translateY: transferAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })
            }]
          }]}>
          <TouchableOpacity style={styles.transferButton}>
            <Image source={require('../../../assets/icons/gcash.png')} style={styles.paymentLogo} />
            <Text style={[styles.transferText, { fontFamily: getFontFamily('medium', true) }]}>
              Transfer funds to GCash
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.transferButton}>
            <Image source={require('../../../assets/icons/maya.png')} style={styles.paymentLogo} />
            <Text style={[styles.transferText, { fontFamily: getFontFamily('medium', true) }]}>
              Transfer funds to Paymaya
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* QR Code Button */}
      <Animated.View style={[styles.qrButtonContainer, {
          opacity: qrButtonAnimation,
          transform: [{
            scale: qrButtonAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }]
        }]}>
        <TouchableOpacity style={styles.qrButton} onPress={openModal}>
          <FontAwesome5 name="qrcode" size={40} color="white" />
        </TouchableOpacity>
      </Animated.View>

      <WalletModal visible={isModalVisible} onClose={closeModal} />

      {isSideMenuVisible && (
        <SideMenu
          isVisible={isSideMenuVisible}
          onClose={() => setSideMenuVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  walletCard: {
    backgroundColor: '#4D0045',
    borderRadius: 24,
    paddingVertical: 35,
    paddingHorizontal: 30,
    marginBottom: 40,
    shadowColor: '#4D0045',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  walletTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    opacity: 0.8,
  },
  walletTitleHighlight: {
    color: '#E8D5E8',
    fontStyle: 'italic',
  },
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 52,
    marginTop: 10,
    letterSpacing: -1,
  },
  transferContainer: {
    gap: 16,
  },
  transferButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  transferText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 18,
  },
  qrButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  qrButton: {
    backgroundColor: '#4D0045',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  paymentLogo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    marginRight: 18,
  },
});
