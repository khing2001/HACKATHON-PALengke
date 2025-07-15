import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFontFamily } from '../../components/FontConfig';
import { LinearGradient } from 'expo-linear-gradient';

interface ViewAnalyticsCardProps {
  onPress: () => void;
  fontsLoaded?: boolean;
  gradient?: boolean;
  subtitle?: string;
}

const ViewAnalyticsCard: React.FC<ViewAnalyticsCardProps> = ({ onPress, fontsLoaded = true, gradient = false, subtitle = 'Summary Statistics' }) => {
  const CardWrapper = gradient
    ? ({ children }: { children: React.ReactNode }) => (
        <LinearGradient
          colors={["#6B026F", "#9920A6", "#BF5DC8", "#CA9ECF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          {children}
        </LinearGradient>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <View style={[styles.card, { backgroundColor: '#6D28D9' }]}>{children}</View>
      );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ marginHorizontal: 0 }}>
      <CardWrapper>
        <View>
          <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>View Analytics</Text>
          <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>{subtitle}</Text>
        </View>
        <Text style={styles.arrow}>→</Text>
      </CardWrapper>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    padding: 28,
    marginHorizontal: 9,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginTop: 2,
  },
  arrow: {
    color: '#fff',
    fontSize: 45,
    fontWeight: 'bold',
  },
});

export default ViewAnalyticsCard;