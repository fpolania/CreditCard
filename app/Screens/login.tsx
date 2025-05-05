import React, { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  Spinner,
  Center,
  useToast
} from 'native-base';
import { authHandler } from '@/app/services/backend/AuthHandler';
import { EMAIL_REGEX } from '@/constants/Regex';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await authHandler(mode, email, password);
      if (response.user) {
        toast.show({ title: 'Éxito', description: 'Sesión iniciada correctamente' });
        navigation.navigate("board" as never);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email);
  };

  return (
    <Center flex={1} px={4}>
      <Box safeArea w="100%" maxW="300" py={10}>
        <Heading textAlign="center" mb={4}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
        </Heading>

        <VStack space={4}>
          <Input
            placeholder="Correo electrónico"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!validateEmail(text)) {
                setError('Correo inválido');
              } else {
                setError('');
              }
            }}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChangeText={setPassword}
          />

          {error !== '' && <Text color="red.500">{error}</Text>}

          {loading ? (
            <Spinner size="lg" />
          ) : (
            <Button
              isDisabled={error !== '' || !email || !password}
              onPress={handleAuth}
            >
              {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          )}

          <Button
            variant="link"
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default LoginScreen;
