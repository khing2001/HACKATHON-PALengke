import React from 'react';
import { getFontFamily } from '../../../components/FontConfig';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface TotalProfitCardProps {
  label: string;
  date: string;
  value: string; // e.g. '+₱200.00'
}

const TotalProfitCard: React.FC<TotalProfitCardProps> = ({ label, date, value }) => {
  const isPositive = value.startsWith('+');

  return (
    <View style={styles.row}>
      {/* Total Profit Card */}
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={isPositive
            ? ['#4A154B', '#5A1F5B', '#6A2A6B', '#7A357B']
            : ['#dc3545', '#c82333', '#bd2130']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <View style={styles.patternCircle1} />
            <View style={styles.patternCircle2} />
            <View style={styles.patternCircle3} />
          </View>

          <View style={styles.cardHeader}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>{isPositive ? '📈' : '📉'}</Text>
            </View>
          </View>

          <Text style={styles.value}>{value}</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.trendContainer}>
              <Text style={styles.trendIcon}>{isPositive ? '↗️' : '↘️'}</Text>
              <Text style={styles.trendText}>
                {isPositive ? '+12.5%' : '-8.3%'}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: width * 0.05,
    marginBottom: 20,
  },
  cardContainer: {
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    borderRadius: 20,
    paddingVertical: width < 380 ? 18 : 22,
    paddingHorizontal: width < 380 ? 12 : 16,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -40,
    right: -20,
  },
  patternCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -30,
    left: -15,
  },
  patternCircle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: '50%',
    right: '30%',
    transform: [{ translateY: -20 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    color: '#fff',
    fontSize: width < 380 ? 16 : 18,
    fontFamily: getFontFamily('bold', true),
    fontWeight: '600',
    letterSpacing: -0.2,
    flex: 1,
  },
  value: {
    color: '#fff',
    fontSize: width < 380 ? 24 : 28,
    fontWeight: '700',
    fontFamily: getFontFamily('bold', true),
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: getFontFamily('medium', true),
    letterSpacing: -0.1,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  trendText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontFamily: getFontFamily('bold', true),
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

export default TotalProfitCard;
