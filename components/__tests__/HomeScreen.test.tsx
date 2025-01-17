import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../../app/redux/actions';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import {HomeScreen} from '@/app/Screens/HomeScreen';

// Mock de servicios
jest.mock('../../app/services/backend/products', () => ({
    getProducts: jest.fn(),
}));

// Mock de Redux
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

// Mock de react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock de useNavigation de @react-navigation/native
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(), // Mock a useNavigation aquí directamente
}));

// Función para envolver el componente en el contexto necesario
const MockNavigator = ({ component }: { component: JSX.Element }) => (
    <NativeBaseProvider>
        <NavigationContainer>
            {component}
        </NavigationContainer>
    </NativeBaseProvider>
);

describe('HomeScreen', () => {
    it('debería llamar a getProducts y despachar los productos', async () => {
        const mockProducts = [{ id: 1, name: 'Producto 1' }, { id: 2, name: 'Producto 2' }];
        
        // Mock de getProducts
        const { getProducts } = require('../../app/services/backend/products');
        getProducts.mockResolvedValue(mockProducts);

        // Mock de useDispatch
        const mockDispatch = jest.fn();
        (useDispatch as any as jest.Mock).mockReturnValue(mockDispatch);

        // Mock de useNavigation
        const mockNavigate = jest.fn();
        (useNavigation as any as jest.Mock).mockReturnValue({ navigate: mockNavigate });

        // Renderizar el componente
        //render(<MockNavigator component={<HomeScreen />} />);

        // Esperar a que se resuelvan las promesas y que se hayan hecho las llamadas
        await waitFor(() => expect(getProducts).toHaveBeenCalledTimes(1));

        // Verificar que se haya despachado la acción setProducts con los productos correctos
        expect(mockDispatch).toHaveBeenCalledWith(setProducts(mockProducts as any));

        // Si es necesario, verifica otras interacciones, como la llamada a navigate
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
