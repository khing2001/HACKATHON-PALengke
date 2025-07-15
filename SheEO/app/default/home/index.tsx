import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Alert, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFontFamily } from '../../../components/FontConfig';
import SideMenu from '../../../components/SideMenu';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeProps {
  fontsLoaded?: boolean;
  onNavigateToShare?: () => void;
  onNavigateToResources?: () => void;
  onNavigateToAnalytics?: () => void;
}

const Home: React.FC<HomeProps> = ({ fontsLoaded = true, onNavigateToShare, onNavigateToResources, onNavigateToAnalytics }) => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);

  // Animation refs
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const greetingAnimation = useRef(new Animated.Value(0)).current;
  const salesCardAnimation = useRef(new Animated.Value(0)).current;
  const metricsAnimation = useRef(new Animated.Value(0)).current;
  const storyAnimation = useRef(new Animated.Value(0)).current;
  const quoteAnimation = useRef(new Animated.Value(0)).current;
  const resourcesAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger animations for smooth entrance
    const animations = [
      { animation: headerAnimation, delay: 0 },
      { animation: greetingAnimation, delay: 200 },
      { animation: salesCardAnimation, delay: 400 },
      { animation: metricsAnimation, delay: 600 },
      { animation: storyAnimation, delay: 800 },
      { animation: quoteAnimation, delay: 1000 },
      { animation: resourcesAnimation, delay: 1200 },
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

  const handleStoryPress = async () => {
    const url = 'https://business.inquirer.net/511302/study-highlights-transformative-power-of-ph-women-sari-preneurs';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the link');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
      >
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
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Ionicons name="menu" size={24} color="#4D0045" />
          </TouchableOpacity>
        </Animated.View>

        {/* Greeting Section */}
        <Animated.View
          style={[
            styles.greetingSection,
            {
              opacity: greetingAnimation,
              transform: [
                {
                  translateY: greetingAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.greeting, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            Hi, storename!
          </Text>
          <Text style={[styles.subGreeting, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
            Kumusta, Ate?
          </Text>
        </Animated.View>

                {/* Modern Sales Dashboard */}
        <Animated.View 
          style={[
            styles.dashboardContainer,
            {
              opacity: salesCardAnimation,
              transform: [
                {
                  translateY: salesCardAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
                {
                  scale: salesCardAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity onPress={onNavigateToAnalytics} activeOpacity={0.8}>
            <LinearGradient
              colors={['#4D0045', '#7B2D6B', '#9B4A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.salesCard}
            >
            <View style={styles.salesHeader}>
              <View style={styles.salesIconContainer}>
                <Ionicons name="trending-up" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.salesTitle, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                Today's Sales
              </Text>
            </View>
            <Text style={[styles.salesDate, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              July 25, 2025
            </Text>
            <View style={styles.salesAmountContainer}>
              <Text style={[styles.salesAmount, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                ₱200.00
              </Text>
              <View style={styles.salesTrend}>
                <Ionicons name="arrow-up" size={16} color="#4AE54A" />
                <Text style={[styles.salesTrendText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                  +12%
                </Text>
              </View>
            </View>
          </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Modern Metrics Cards */}
        <Animated.View
          style={[
            styles.metricsContainer,
            {
              opacity: metricsAnimation,
              transform: [
                {
                  translateY: metricsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [25, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.metricCard} onPress={onNavigateToAnalytics} activeOpacity={0.8}>
            <View style={styles.metricHeader}>
              <Ionicons name="cash" size={20} color="#4D0045" />
              <Text style={[styles.metricLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                Today's Profit
              </Text>
            </View>
            <Text style={[styles.metricAmount, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              +₱50.00
            </Text>
            <View style={styles.metricProgress}>
              <View style={[styles.metricProgressBar, { width: '65%' }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.metricCard} onPress={onNavigateToAnalytics} activeOpacity={0.8}>
            <View style={styles.metricHeader}>
              <Ionicons name="wallet" size={20} color="#4D0045" />
              <Text style={[styles.metricLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                Capital Spent
              </Text>
            </View>
            <Text style={[styles.metricAmount, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              ₱150.00
            </Text>
            <View style={styles.metricProgress}>
              <View style={[styles.metricProgressBar, { width: '45%' }]} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Today's Story Section */}
        <Animated.View
          style={{
            opacity: storyAnimation,
            transform: [
              {
                translateY: storyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [40, 0],
                }),
              },
              {
                scale: storyAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity style={styles.storySection} onPress={handleStoryPress} activeOpacity={0.9}>
            <View style={styles.storyContainer}>
              <Image
                source={require('../../../assets/news.png')}
                style={styles.storyImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(77,0,69,0.95)']}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.storyGradient}
              />
              <View style={styles.storyOverlay}>
                <View style={styles.storyBadge}>
                  <Text style={[styles.storyLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                    Today's Story
                  </Text>
                </View>
                <Text style={[styles.storyTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  Study highlights transformative power of PH women 'sari-preneurs'
                </Text>
                <View style={styles.storyFooter}>
                  <Text style={[styles.storyReadTime, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                    5 min read
                  </Text>
                  <Ionicons name="arrow-forward-circle" size={24} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Daily Quote and Share Section */}
        <Animated.View
          style={[
            styles.quoteShareContainer,
            {
              opacity: quoteAnimation,
              transform: [
                {
                  translateY: quoteAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [35, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.quoteCard}>
            <View style={styles.quoteHeader}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#4D0045" />
              <Text style={[styles.quoteTitle, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                Daily Inspiration
              </Text>
            </View>
            <Text style={[styles.quoteText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              "The secret of getting ahead is getting started"
            </Text>
            <Text style={[styles.quoteAuthor, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
              - Mark Twain
            </Text>
          </View>

          <TouchableOpacity style={styles.shareCard} onPress={onNavigateToShare}>
            <View style={styles.shareHeader}>
              <Ionicons name="share-social" size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.shareTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Share your store
            </Text>
            <Text style={[styles.shareText, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              Get more customers
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Resources Section */}
        <Animated.View
          style={[
            styles.resourcesContainer,
            {
              opacity: resourcesAnimation,
              transform: [
                {
                  translateY: resourcesAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [35, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.resourcesCard} activeOpacity={0.8} onPress={onNavigateToResources}>
            <View style={styles.resourcesContent}>
              <View style={styles.resourcesIconContainer}>
                <Ionicons name="library" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.resourcesTextContainer}>
                <Text style={[styles.resourcesQuestion, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                  Having trouble starting your business?
                </Text>
                <Text style={[styles.resourcesButtonText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                  Resources
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {isSideMenuVisible && (
        <SideMenu
          isVisible={isSideMenuVisible}
          onClose={() => setSideMenuVisible(false)}
          onNavigateToResources={onNavigateToResources}
          onNavigateToAnalytics={onNavigateToAnalytics}
        />
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30, // Reduced from 50px
    paddingBottom: 50, // Matches top padding for symmetry
  },
  header: {
    paddingTop: 0, // Removed since paddingTop is now in scrollContent
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    color: '#4D0045',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
  },
  dashboardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  salesCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  salesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  salesIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
  },
  salesTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  salesDate: {
    fontSize: 14,
    color: '#E8D5E8',
    marginBottom: 15,
  },
  salesAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salesAmount: {
    fontSize: 36,
    color: '#FFFFFF',
  },
  salesTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  salesTrendText: {
    fontSize: 14,
    color: '#4AE54A',
    marginLeft: 5,
  },
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    height: 140,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIconContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  metricAmount: {
    fontSize: 28,
    color: '#4D0045',
    marginBottom: 10,
  },
  metricProgress: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  metricProgressBar: {
    height: '100%',
    backgroundColor: '#4D0045',
    borderRadius: 4,
  },
  storySection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  storyContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  storyGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  storyOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  storyBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  storyLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  storyTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 10,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyReadTime: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  quoteShareContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    flex: 1,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quoteTitle: {
    fontSize: 16,
    color: '#4D0045',
    marginLeft: 8,
  },
  quoteText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 15,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  shareCard: {
    backgroundColor: '#4D0045',
    borderRadius: 16,
    padding: 20,
    height: 160,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  shareHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  shareTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  shareText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4D0045',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  fab: {
    backgroundColor: '#4D0045',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4D0045',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  resourcesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resourcesCard: {
    backgroundColor: '#4D0045',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  resourcesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourcesIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 10,
    marginRight: 15,
  },
  resourcesTextContainer: {
    flex: 1,
  },
  resourcesQuestion: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  resourcesButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
