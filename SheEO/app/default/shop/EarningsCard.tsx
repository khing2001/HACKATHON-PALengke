import React from 'react';
import { getFontFamily } from '../../../components/FontConfig';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface BarData {
  value: number;
  color: string;
}

interface EarningsCardProps {
  bars: BarData[];
}

const EarningsCard: React.FC<EarningsCardProps> = ({ bars }) => {
  const maxValue = Math.max(...bars.map(bar => bar.value));
  const barWidth = (width - 120) / bars.length - 8; // Responsive bar width

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.card}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Earnings Overview</Text>
          <Text style={styles.subtitle}>Weekly Performance</Text>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.barChartRow}>
            {bars.map((bar, i) => {
              const normalizedHeight = (bar.value / maxValue) * 100;
              return (
                <View key={i} style={[styles.barCol, { width: barWidth }]}>
                  <View style={styles.barContainer}>
                    <LinearGradient
                      colors={[bar.color, `${bar.color}80`]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={[
                        styles.bar,
                        {
                          height: Math.max(normalizedHeight, 8),
                          minHeight: 8,
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || `D${i + 1}`}
                  </Text>
                  <Text style={styles.barValue}>₱{bar.value}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Summary stats */}
        <View style={styles.summaryContainer}>
          <LinearGradient
            colors={['#4A154B', '#5A1F5B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average</Text>
                <Text style={styles.summaryValue}>₱{Math.round(bars.reduce((a, b) => a + b.value, 0) / bars.length)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Best Day</Text>
                <Text style={styles.summaryValue}>₱{maxValue}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: width < 380 ? 24 : 28,
    color: '#4A154B',
    fontWeight: '700',
    fontFamily: getFontFamily('bold', true),
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A2A6B',
    fontFamily: getFontFamily('medium', true),
    letterSpacing: -0.2,
    opacity: 0.7,
  },
  chartContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  barCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '80%',
    borderRadius: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  barLabel: {
    fontSize: 11,
    color: '#4A154B',
    fontFamily: getFontFamily('medium', true),
    marginBottom: 2,
    opacity: 0.8,
    letterSpacing: -0.1,
  },
  barValue: {
    fontSize: 10,
    color: '#6A2A6B',
    fontFamily: getFontFamily('bold', true),
    opacity: 0.6,
    letterSpacing: -0.1,
  },
  summaryContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: getFontFamily('medium', true),
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: getFontFamily('bold', true),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

export default EarningsCard;
