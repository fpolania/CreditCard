import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SplashScreen from '../Screens/SplashScreen';
import HomeScreen from '../Screens/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from 'native-base';
import CartScreen from '../Screens/ShoppingCartScreen';
import ConfirmationScreen from '../Screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();
export const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen}
                    options={({ navigation }) => ({
                        title: 'Productos',
                        headerTitleAlign: 'center',
                        unmountOnBlur: true,
                        headerShown: true,
                        swipeEnabled: true,
                    })} />
                <Stack.Screen name="Cart" component={CartScreen}
                    options={({ navigation }) => ({
                        title: 'Detalle de compra',
                        headerTitleAlign: 'center',
                        unmountOnBlur: true,
                        headerShown: true,
                        swipeEnabled: true,
                        headerLeft: () => (
                            <Icon
                                color={'black'}
                                size={8}
                                onPress={() => navigation.navigate('Home')}
                                as={<MaterialIcons name='chevron-left' />}
                            />
                        ),
                    })} />
                <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}

