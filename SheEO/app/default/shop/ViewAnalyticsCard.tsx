import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFontFamily } from '../../../components/FontConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
          colors={["#4A154B", "#5A1F5B", "#6A2A6B", "#7A357B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {children}
        </LinearGradient>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <View style={[styles.card, { backgroundColor: '#4A154B' }]}>{children}</View>
      );

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.container}>
      <CardWrapper>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { fontFamily: getFontFamily('bold', fontsLoaded) }]}>View Analytics</Text>
            <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular', fontsLoaded) }]}>{subtitle}</Text>
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="analytics-outline" size={28} color="rgba(255,255,255,0.9)" />
          </View>
        </View>
      </CardWrapper>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#4A154B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
});

export default ViewAnalyticsCard;
