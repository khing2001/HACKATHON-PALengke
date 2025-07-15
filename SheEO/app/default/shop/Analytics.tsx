import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, Dimensions, Animated, Easing, Platform, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import EarningsCard from './EarningsCard';
import StatCardsRow from './StatCardsRow';
import TotalProfitCard from './TotalProfitCard';
import { useRouter } from 'expo-router';
import { getFontFamily } from '../../../components/FontConfig';

const { width, height } = Dimensions.get('window');

interface AnalyticsProps {
  onBack?: () => void;
}

const BAR_DATA = [
  { value: 80, color: '#4A154B' },
  { value: 60, color: '#5A1F5B' },
  { value: 40, color: '#6A2A6B' },
  { value: 110, color: '#7A357B' },
  { value: 70, color: '#8A408B' },
  { value: 50, color: '#9A4B9B' },
  { value: 35, color: '#AA56AB' },
];

const TOTAL_SPENT = '-₱150.00';
const PROFIT_TODAY = '+₱50.00';
const PROFIT_WEEKLY = '+₱350.00';
const TOTAL_PROFIT = '+₱200.00';
const PROFIT_LABEL = '📈 Total Profit';
const PROFIT_DATE = 'As of July 25, 2025';

const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [profitTab, setProfitTab] = useState<'today' | 'weekly'>('today');
  const router = useRouter();

  const headerAnimation = useRef(new Animated.Value(0)).current;
  const titleAnimation = useRef(new Animated.Value(0)).current;
  const earningsAnimation = useRef(new Animated.Value(0)).current;
  const statsAnimation = useRef(new Animated.Value(0)).current;
  const profitAnimation = useRef(new Animated.Value(0)).current;
  const downloadAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      { animation: headerAnimation, delay: 0 },
      { animation: titleAnimation, delay: 100 },
      { animation: earningsAnimation, delay: 200 },
      { animation: statsAnimation, delay: 300 },
      { animation: profitAnimation, delay: 400 },
      { animation: downloadAnimation, delay: 500 },
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
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true; 
      }
      return false; 
    });

    return () => backHandler.remove();
  }, [onBack]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack || (() => router.push('/shop'))}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Earnings Card */}
        <Animated.View 
          style={[
            styles.earningsCardWrapper,
            {
              opacity: earningsAnimation,
              transform: [
                {
                  translateY: earningsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <EarningsCard bars={BAR_DATA} />
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View 
          style={[
            {
              opacity: statsAnimation,
              transform: [
                {
                  translateY: statsAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <StatCardsRow
            totalSpent={TOTAL_SPENT}
            profitToday={PROFIT_TODAY}
            profitWeekly={PROFIT_WEEKLY}
            profitTab={profitTab}
            onTabChange={setProfitTab}
          />
        </Animated.View>

        {/* Total Profit Card */}
        <Animated.View 
          style={[
            {
              opacity: profitAnimation,
              transform: [
                {
                  translateY: profitAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TotalProfitCard
            label={PROFIT_LABEL}
            date={PROFIT_DATE}
            value={TOTAL_PROFIT}
          />
        </Animated.View>

        {/* Download Button */}
        <Animated.View 
          style={[
            {
              opacity: downloadAnimation,
              transform: [
                {
                  translateY: downloadAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.downloadButton} 
            onPress={() => {/* TODO: implement download/report */}}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A154B', '#5A1F5B', '#6A2A6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.downloadButtonGradient}
            >
              <Ionicons name="download-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.downloadButtonText}>Download Report</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
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
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    color: '#1E293B',
    fontWeight: '600',
    fontFamily: getFontFamily('bold', true),
  },
  headerSpacer: {
    width: 40,
  },
  earningsCardWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  downloadButton: {
    alignSelf: 'center',
    marginTop: 20,
    marginHorizontal: width * 0.05,
    borderRadius: 16,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: width * 0.5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: getFontFamily('bold', true),
    letterSpacing: -0.2,
  },
});

export default Analytics;
