import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const ScreenComponent = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Screen Placeholder</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: 10,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default ScreenComponent;
