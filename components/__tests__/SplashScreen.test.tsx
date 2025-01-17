import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '@/app/Screens/SplashScreen';

jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => 'StatusBar');

describe('SplashScreen', () => {
  it('debe renderizar el componente correctamente', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('debe mostrar el texto de bienvenida', () => {
    const { queryByText } = render(
      <NavigationContainer>
        <SplashScreen />
      </NavigationContainer>
    );
    const welcomeText = queryByText('Bienvenido a Mi App');
    expect(welcomeText).not.toBeNull();
  });
});
