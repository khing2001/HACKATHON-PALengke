import React from 'react';
import { getFontFamily } from '../../../components/FontConfig';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface StatCardsRowProps {
  totalSpent: string;
  profitToday: string;
  profitWeekly: string;
  profitTab: 'today' | 'weekly';
  onTabChange: (tab: 'today' | 'weekly') => void;
}

const StatCardsRow: React.FC<StatCardsRowProps> = ({ totalSpent, profitToday, profitWeekly, profitTab, onTabChange }) => {
  return (
    <View style={styles.row}>
      {/* Total Spent Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>💸</Text>
            </View>
            <Text style={styles.label}>Total Spent</Text>
          </View>

          {/* Empty space to match profit card structure */}
          <View style={styles.spacer} />

          <View style={styles.valueContainer}>
            <Text style={styles.valueSpent}>{totalSpent}</Text>
          </View>
        </View>
      </View>

      {/* Profit Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📈</Text>
            </View>
            <Text style={styles.label}>Profit</Text>
          </View>

          <View style={styles.tabsContainer}>
            <View style={styles.tabsBackground}>
              <TouchableOpacity
                style={[styles.tab, profitTab === 'today' && styles.tabActive]}
                onPress={() => onTabChange('today')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, profitTab === 'today' && styles.tabTextActive]}>Today</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, profitTab === 'weekly' && styles.tabActive]}
                onPress={() => onTabChange('weekly')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, profitTab === 'weekly' && styles.tabTextActive]}>Weekly</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.valueProfit}>{profitTab === 'today' ? profitToday : profitWeekly}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  cardContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
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
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontFamily: getFontFamily('medium', true),
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  valueSpent: {
    fontSize: 28,
    color: '#4D0045',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    textAlign: 'right',
  },
  valueProfit: {
    fontSize: 28,
    color: '#4D0045',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    textAlign: 'right',
  },
  tabsContainer: {
    alignItems: 'flex-start',
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#4D0045',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontFamily: getFontFamily('medium', true),
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default StatCardsRow;
