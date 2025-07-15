import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, Share, Alert, TextInput, TouchableWithoutFeedback, Keyboard, Platform, Clipboard, SafeAreaView, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getFontFamily } from '../../../components/FontConfig';
import { ShareStoreAI } from '../../../lib/AI/shareStoreAI';
import { LoadSampleProducts } from '../../../lib/inventory';

LoadSampleProducts();
interface SharePageProps {
  fontsLoaded?: boolean;
  onBack?: () => void;
}

const SharePage: React.FC<SharePageProps> = ({ fontsLoaded = true, onBack }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
//   const [content, setContent] = useState(`🛒 Visit Nanay Rita's Store!
//
// Fresh vegetables, fruits, and daily essentials at unbeatable prices!
//
// 🥬 Fresh Vegetables: ₱20-50
// 🍎 Seasonal Fruits: ₱30-80
// 🥛 Daily Essentials: ₱15-100
//
// 📍 Located at: Barangay San Jose, Batangas City
// ⏰ Open: 6:00 AM - 8:00 PM daily
//
// Come visit us for quality products and friendly service! 🌟`);
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetch = async() => {
      const result = await ShareStoreAI({storeName: 'Nanay Rita', location: 'Lahug'})
      setContent(result);
    }

    fetch();
  }, [])
  // Animation refs
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const regenerateAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stagger animations for smooth entrance
    const animations = [
      { animation: headerAnimation, delay: 0 },
      { animation: contentAnimation, delay: 200 },
      { animation: buttonAnimation, delay: 400 },
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

  useEffect(() => {
    // Handle Android back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior
    });

    return () => backHandler.remove();
  }, [onBack]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);

    try{
    const newShare = await ShareStoreAI({storeName: 'Nanay Rita', location: 'Lahug'})

    // Animate regenerate button
    Animated.sequence([
      Animated.timing(regenerateAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(regenerateAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setContent(newShare);
    } catch(e){
      console.error('Error during regeneration', e);
      Alert.alert('Error', 'Something went wrong while generating new message');
    } finally {
      setIsRegenerating(false);
    }

  }

  const handleShare = async () => {
    try {
      setIsSharing(true);

      // Validate content
      if (!content || content.trim().length === 0) {
        Alert.alert('Error', 'Please add some content to share');
        return;
      }

      const shareOptions = {
        message: content,
        // Remove url property to prevent link conversion
        ...(Platform.OS === 'ios' && { title: 'Share Store' })
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        // Optional: Show success message
        // Alert.alert('Success', 'Content shared successfully!');
      } else if (result.action === Share.dismissedAction) {
        // console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share error:', error);

      // Fallback to clipboard
      try {
        Clipboard.setString(content);
        Alert.alert(
          'Share Failed',
          'Unable to share directly. Content copied to clipboard instead. You can paste it in your preferred app.',
          [{ text: 'OK' }]
        );
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        Alert.alert(
          'Error',
          'Unable to share or copy content. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#4D0045" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
          Share your Store!
        </Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Content Card */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: contentAnimation,
              transform: [
                {
                  translateY: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                {
                  scale: contentAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.gradientBorderContainer}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899', '#F97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={styles.contentCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconContainer}>
                    <Ionicons name="megaphone" size={20} color="#8B5CF6" />
                  </View>
                  <Text style={[styles.cardTitle, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                    Your Store Post
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.editableText,
                    { fontFamily: getFontFamily('regular', fontsLoaded) },
                    isEditing && styles.editableTextFocused
                  ]}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                  placeholder="Generating your perfect store post..."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                />
              </View>
            </LinearGradient>
          </View>
          <View style={styles.helperContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={[styles.helperText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              {isEditing ? 'Tap outside to finish editing' : 'Tap to customize your message'}
            </Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Action Buttons */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnimation,
            transform: [
              {
                translateY: buttonAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert('Download', 'Download feature coming soon!')}
        >
          <Ionicons name="download-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: regenerateAnimation }] }}>
          <TouchableOpacity
            style={[styles.regenerateButton, isRegenerating && styles.regenerateButtonDisabled]}
            onPress={handleRegenerate}
            disabled={isRegenerating}
          >
            <Ionicons name="refresh-outline" size={20} color="#8B5CF6" />
            <Text style={[styles.regenerateButtonText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
              {isRegenerating ? 'Generating...' : 'Regenerate'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareButtonGradient}
          >
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
            <Text style={[styles.shareButtonText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Share
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SharePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.05,
    shadowRadius: Platform.OS === 'ios' ? 6 : 4,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  gradientBorderContainer: {
    borderRadius: 20,
    padding: 2,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 8 : 8,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.1,
    shadowRadius: Platform.OS === 'ios' ? 28 : 24,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    color: '#1E293B',
  },
  editableText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 26,
    padding: 0,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  editableTextFocused: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FAFBFF',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 16,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 6 : 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.15,
    shadowRadius: Platform.OS === 'ios' ? 12 : 8,
    elevation: 4,
  },
  regenerateButtonDisabled: {
    opacity: 0.6,
  },
  regenerateButtonText: {
    color: '#8B5CF6',
    fontSize: 15,
  },
  shareButton: {
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 8 : 6,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.25,
    shadowRadius: Platform.OS === 'ios' ? 16 : 12,
    elevation: 6,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});
