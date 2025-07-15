import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditProducts = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Products</Text>
      {/* Add your edit products UI here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#720877',
  },
});

export default EditProducts; 