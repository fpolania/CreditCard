module.exports = {
    presets: [
      'babel-preset-expo',   // Si usas Expo
      '@babel/preset-react', // Para JSX
      '@babel/preset-typescript' // Para TypeScript
    ],
    plugins: [
      'react-native-reanimated/plugin' // Si usas React Native Reanimated
    ]
  };