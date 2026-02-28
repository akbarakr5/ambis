import { View, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>☕</Text>
      <Text style={styles.title}>Cafe Admin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
  },
});
