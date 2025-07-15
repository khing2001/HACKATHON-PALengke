import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, Easing, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getFontFamily, loadFonts } from '../../../components/FontConfig';

const { width, height } = Dimensions.get('window');

export default function NewSuggestions() {
  const navigation = useNavigation();
  const { storeName, selectedStore, budget, location } = useLocalSearchParams();
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Animation refs
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const contentAnimation = useRef(new Animated.Value(0)).current;
  const bottomAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadAppFonts = async () => {
      const success = await loadFonts();
      setFontsLoaded(success);
    };
    loadAppFonts();

    // Stagger animations for smooth entrance
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  // AI-replaceable data structures
  const productSuggestions = [
    {
      id: 1,
      name: 'Squidballs',
      pieces: 200,
      cost: 8.00,
      totalCost: 1600.00,
      price: 12.00,
      profit: 800.00
    },
    {
      id: 2,
      name: 'Fishballs',
      pieces: 150,
      cost: 6.00,
      totalCost: 900.00,
      price: 10.00,
      profit: 600.00
    },
    {
      id: 3,
      name: 'Kikiam',
      pieces: 100,
      cost: 10.00,
      totalCost: 1000.00,
      price: 15.00,
      profit: 500.00
    },
  ];

  // AI-replaceable budget allocation
  const budgetAllocation = {
    totalBudget: parseInt(budget as string) || 5000,
    categories: [
      {
        id: 1,
        name: 'Starter inventory (products above)',
        amount: 3500,
        percentage: 70,
        color: '#4D0045',
        description: 'Initial product stock to start selling'
      },
      {
        id: 2,
        name: 'Equipment & setup',
        amount: 800,
        percentage: 16,
        color: '#7B2D6B',
        description: 'Cooking equipment, utensils, and basic setup'
      },
      {
        id: 3,
        name: 'Emergency fund',
        amount: 700,
        percentage: 14,
        color: '#9B4A8A',
        description: 'Reserve for unexpected expenses'
      }
    ]
  };

  // AI-replaceable business strategies
  const businessStrategies = [
    {
      id: 1,
      title: 'Location Strategy',
      icon: 'location',
      content: 'Set up near schools, offices, or busy intersections during peak hours (7-9 AM, 12-1 PM, 5-7 PM) to maximize customer traffic.',
      priority: 'High'
    },
    {
      id: 2,
      title: 'Customer Retention',
      icon: 'people',
      content: 'Offer loyalty cards - buy 10 get 1 free. Remember regular customers\' preferences to build lasting relationships.',
      priority: 'High'
    },
    {
      id: 3,
      title: 'Product Expansion',
      icon: 'trending-up',
      content: 'Start with basic items, then gradually add rice meals, drinks, and seasonal favorites based on customer demand.',
      priority: 'Medium'
    },
    {
      id: 4,
      title: 'Cost Management',
      icon: 'calculator',
      content: 'Track daily expenses and sales. Aim for 40-60% profit margin. Buy ingredients in bulk to reduce costs.',
      priority: 'Medium'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: headerAnimation,
            transform: [
              {
                translateY: headerAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['#4D0045', '#7B2D6B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/new-storeoptions')}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            Business Idea
          </Text>
          
          <View style={styles.businessInfoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="storefront" size={16} color="#E8D5E8" />
                <Text style={[styles.infoLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>Store Type</Text>
                <Text style={[styles.infoValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  {selectedStore}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="location" size={16} color="#E8D5E8" />
                <Text style={[styles.infoLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>Location</Text>
                <Text style={[styles.infoValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  {location}
                </Text>
              </View>
            </View>
            <View style={styles.budgetContainer}>
              <Ionicons name="wallet" size={18} color="#4AE54A" />
              <Text style={[styles.budgetLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                Total Budget
              </Text>
              <Text style={[styles.budgetValue, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                ₱{budget}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.View 
        style={[
          styles.scrollContainer,
          {
            opacity: contentAnimation,
            transform: [
              {
                translateY: contentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Product Suggestions Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Recommended Products
            </Text>
            <Text style={[styles.sectionSubtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              Based on your store type and budget
            </Text>
            
            {productSuggestions.map((product, index) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <Text style={[styles.productName, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    {product.name}
                  </Text>
                  <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.productDetails}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                      Quantity:
                    </Text>
                    <Text style={[styles.detailValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                      {product.pieces} pcs
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                      Cost per piece:
                    </Text>
                    <Text style={[styles.detailValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                      ₱{product.cost.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                      Total cost:
                    </Text>
                    <Text style={[styles.detailValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                      ₱{product.totalCost.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                      Selling price:
                    </Text>
                    <Text style={[styles.detailValue, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                      ₱{product.price.toFixed(2)}/pc
                    </Text>
                  </View>
                  <View style={[styles.detailRow, styles.profitRow]}>
                    <Text style={[styles.detailLabel, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      Expected profit:
                    </Text>
                    <Text style={[styles.profitValue, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      +₱{product.profit.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* AI-Replaceable Puhunan Planner Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Capital Allocation Plan
            </Text>
            <Text style={[styles.sectionSubtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              Smart budget distribution for your business
            </Text>
            
            <View style={styles.plannerCard}>
              <LinearGradient
                colors={['#F8F9FA', '#FFFFFF']}
                style={styles.plannerGradient}
              >
                <View style={styles.plannerHeader}>
                  <Ionicons name="calculator" size={24} color="#4D0045" />
                  <Text style={[styles.plannerTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    Budget Breakdown
                  </Text>
                </View>
                
                <View style={styles.budgetBreakdown}>
                  {budgetAllocation.categories.map((category, index) => (
                    <View key={category.id} style={styles.budgetItem}>
                      <View style={[styles.budgetDot, { backgroundColor: category.color }]} />
                      <View style={styles.budgetItemContent}>
                        <Text style={[styles.budgetItemText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                          {category.name}
                        </Text>
                        <Text style={[styles.budgetItemDescription, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                          {category.description}
                        </Text>
                      </View>
                      <View style={styles.budgetAmountContainer}>
                        <Text style={[styles.budgetAmount, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                          ₱{category.amount.toLocaleString()}
                        </Text>
                        <Text style={[styles.budgetPercentage, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                          {category.percentage}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
                
                <View style={styles.totalBudget}>
                  <Text style={[styles.totalLabel, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    Total Allocated:
                  </Text>
                  <Text style={[styles.totalAmount, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                    ₱{budgetAllocation.totalBudget.toLocaleString()}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* AI-Replaceable Business Strategy Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Business Strategy & Tips
            </Text>
            <Text style={[styles.sectionSubtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
              Proven strategies to grow your {selectedStore} business
            </Text>
            
            {businessStrategies.map((strategy, index) => (
              <View key={strategy.id} style={styles.strategyCard}>
                <View style={styles.strategyHeader}>
                  <View style={styles.strategyIconContainer}>
                    <Ionicons name={strategy.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.strategyTitleContainer}>
                    <Text style={[styles.strategyTitle, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
                      {strategy.title}
                    </Text>
                    <View style={[styles.priorityBadge, { 
                      backgroundColor: strategy.priority === 'High' ? '#FF6B6B' : '#4ECDC4' 
                    }]}>
                      <Text style={[styles.priorityText, { fontFamily: getFontFamily('medium', fontsLoaded) }]}>
                        {strategy.priority} Priority
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.strategyContent, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>
                  {strategy.content}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Fixed Bottom Buttons */}
      <Animated.View 
        style={[
          styles.bottomContainer,
          {
            opacity: bottomAnimation,
            transform: [
              {
                translateY: bottomAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.regenerateButton}>
          <Ionicons name="refresh" size={20} color="#4D0045" />
          <Text style={[styles.regenerateText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
            Regenerate
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => router.push('/new-inventory')}
        >
          <LinearGradient
            colors={['#4D0045', '#7B2D6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmGradient}
          >
            <Text style={[styles.confirmText, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>
              Confirm Plan
            </Text>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  businessInfoContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoLabel: {
    fontSize: 12,
    color: '#E8D5E8',
    marginBottom: 4,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#E8D5E8',
    marginLeft: 8,
    flex: 1,
  },
  budgetValue: {
    fontSize: 18,
    color: '#4AE54A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for fixed bottom buttons
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#4D0045',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  productName: {
    fontSize: 18,
    color: '#4D0045',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4D0045',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  profitRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  profitValue: {
    fontSize: 16,
    color: '#4AE54A',
  },
  plannerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plannerGradient: {
    padding: 20,
  },
  plannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  plannerTitle: {
    fontSize: 18,
    color: '#4D0045',
    marginLeft: 10,
  },
  budgetBreakdown: {
    gap: 12,
    marginBottom: 20,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  budgetDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4D0045',
    marginRight: 12,
    marginTop: 6,
  },
  budgetItemContent: {
    flex: 1,
    marginRight: 12,
  },
  budgetItemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  budgetItemDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  budgetAmountContainer: {
    alignItems: 'flex-end',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#4D0045',
  },
  budgetPercentage: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  totalBudget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#4D0045',
  },
  totalAmount: {
    fontSize: 18,
    color: '#4D0045',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 35 : 15,
    flexDirection: 'row',
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  regenerateButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4D0045',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  regenerateText: {
    fontSize: 16,
    color: '#4D0045',
  },
  confirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  confirmGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  confirmText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  // Strategy Section Styles
  strategyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  strategyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  strategyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4D0045',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  strategyTitleContainer: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: 16,
    color: '#4D0045',
    marginBottom: 6,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  strategyContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
