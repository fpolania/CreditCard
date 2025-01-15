import React from 'react';
import { registerRootComponent } from 'expo';
import { Navigation } from './app/navigation/navigation';
import { NativeBaseProvider } from 'native-base';

registerRootComponent(App);
export default function App() {
    return (
        <NativeBaseProvider>
            <Navigation />
        </NativeBaseProvider>
    );
}
