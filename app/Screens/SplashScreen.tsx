import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

/**
 * SplashScreen luego de 4000 remplza la url y nos muestra el home
 *
 * @return {*} 
 */
const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home' as never);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F6D7A" />
      <Image source={require('../../assets/images/partial-react-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bienvenido a Mi App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F6D7A',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SplashScreen;
