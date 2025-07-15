import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';

interface TotalProfitCardProps {
  label: string;
  date: string;
  value: string; // e.g. '+₱200.00'
}

const TotalProfitCard: React.FC<TotalProfitCardProps> = ({ label, date, value }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftCol}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const CARD_RADIUS = 22;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#5A455C',
    borderRadius: CARD_RADIUS,
    marginTop: 10,
    paddingVertical: 28,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 17,
    fontFamily: getFontFamily('bold', true),
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  date: {
    color: '#fff',
    fontSize: 11,
    opacity: 0.7,
    fontFamily: getFontFamily('regular', true),
    marginBottom: 10,
    letterSpacing: 0.1,
  },
  value: {
    color: '#fff',
    fontSize: 44,
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold', true),
    letterSpacing: 0.1,
    marginTop: 2,
  },
});

export default TotalProfitCard; 