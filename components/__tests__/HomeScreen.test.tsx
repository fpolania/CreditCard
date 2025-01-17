import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { rootReducer } from '../../app/redux/store';
import { HomeScreen } from '@/app/Screens/HomeScreen';
import { configureStore } from '@reduxjs/toolkit';
import { NativeBaseProvider } from 'native-base';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

describe('HomeScreen', () => {
    it('debe mostrar los productos y el botón de compra', () => {
        const { getByText, getByTestId } = render(
            <Provider store={store}>
                <NavigationContainer>
                    <HomeScreen />
                </NavigationContainer>
            </Provider>
        );

        expect(getByText('Producto 1')).toBeTruthy();
        expect(getByText('$10')).toBeTruthy();
        expect(getByText('Producto 2')).toBeTruthy();
        expect(getByText('$20')).toBeTruthy();

        const buyButton = getByTestId('buy-button');
        expect(buyButton).toBeTruthy();
    });

    it('debe manejar la acción de compra cuando se presiona el botón', async () => {
        const { getByTestId, getByText, debug } = render(
            <Provider store={store}>
                <NavigationContainer>
                    <NativeBaseProvider>
                        <HomeScreen />
                    </NativeBaseProvider>
                </NavigationContainer>
            </Provider>
        );
    
        debug();
    
        const buyButton = getByTestId('buy-button');
        fireEvent.press(buyButton);
    
        await waitFor(() => getByText('1'));
    
        expect(getByText('1')).toBeTruthy();
    });
});
