import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';

interface BarData {
  value: number;
  color: string;
  label?: string;
}

interface EarningsCardProps {
  bars: BarData[];
}

const EarningsCard: React.FC<EarningsCardProps> = ({ bars }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Earnings</Text>
      <View style={styles.barChartRow}>
        {bars.map((bar, i) => (
          <View key={i} style={styles.barCol}>
            <View style={[styles.bar, { height: bar.value, backgroundColor: bar.color }]} />
            <Text style={styles.barLabel}>Date</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const CARD_RADIUS = 22;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: CARD_RADIUS,
    marginBottom: 26,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    color: '#720877',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    marginBottom: 18,
    textAlign: 'left',
    letterSpacing: 0.2,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    height: 120,
    paddingHorizontal: 2,
  },
  barCol: {
    alignItems: 'center',
    width: 48,
  },
  bar: {
    width: 38,
    borderRadius: 14,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B026F',
    marginTop: 4,
    fontFamily: getFontFamily('regular', true),
    opacity: 0.7,
    letterSpacing: 0.1,
  },
});

export default EarningsCard; 