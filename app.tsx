import React from 'react';
import { registerRootComponent } from 'expo';
import { Navigation } from './app/navigation/navigation';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import store from './app/redux/store';

registerRootComponent(App);
export default function App() {
    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <Navigation />
            </NativeBaseProvider>
        </Provider>
    );
}
