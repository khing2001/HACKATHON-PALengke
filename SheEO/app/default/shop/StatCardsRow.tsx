import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';

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
      <View style={styles.cardLeft}>
        <Text style={styles.label}>Total Spent</Text>
        <Text style={styles.valueSpent}>{totalSpent}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={styles.tabsLabelWrapper}>
          <Text style={styles.label}>Profit</Text>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, profitTab === 'today' && styles.tabActive]}
              onPress={() => onTabChange('today')}
            >
              <Text style={[styles.tabText, profitTab === 'today' && styles.tabTextActive]}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, profitTab === 'weekly' && styles.tabActive]}
              onPress={() => onTabChange('weekly')}
            >
              <Text style={[styles.tabText, profitTab === 'weekly' && styles.tabTextActive]}>Weekly</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.valueProfit}>{profitTab === 'today' ? profitToday : profitWeekly}</Text>
      </View>
    </View>
  );
};

const CARD_RADIUS = 22;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
    gap: 14,
  },
  cardLeft: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#6C0370',
    borderRadius: CARD_RADIUS,
    paddingVertical: 22,
    paddingHorizontal: 14,
    marginRight: 7,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch', // Allow label to align left
  },
  cardRight: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#6C0370',
    borderRadius: CARD_RADIUS,
    paddingVertical: 22,
    paddingHorizontal: 14,
    marginLeft: 7,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch', // Allow tabs/label to align left
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabsLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start', // Ensure tabs/label are at upper left
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 20,
    color: '#720877',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    marginBottom: 5,
    textAlign: 'left',
    letterSpacing: 0.1,
    alignSelf: 'flex-start', // Ensure label is at upper left
  },
  valueSpent: {
    fontSize: 35,
    color: '#720877',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 0.1,
    alignSelf: 'flex-end',
  },
  valueProfit: {
    fontSize: 35,
    color: '#720877',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 0.1,
    alignSelf: 'flex-end', 
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 2,
    gap: 4,
  },
  tab: {
    borderWidth: 1.2,
    borderColor: '#6C0370',
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 1,
    marginRight: 2,
    backgroundColor: '#fff',
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  tabActive: {
    backgroundColor: '#6C0370',
  },
  tabText: {
    fontSize: 15,
    color: '#6C0370',
    fontFamily: getFontFamily('bold', true),
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: '#fff',
  },
});

export default StatCardsRow; 