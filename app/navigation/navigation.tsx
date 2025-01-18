import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SplashScreen from '../Screens/SplashScreen';
import { HomeScreen } from '../Screens/HomeScreen';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CartScreen from '../Screens/ShoppingCartScreen';
import ConfirmationScreen from '../Screens/ConfirmationScreen';
import { MaterialIcons } from "@expo/vector-icons";
import { Icon } from "native-base";


const Drawer = createDrawerNavigator();
export const Navigation = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Drawer.Screen name="Splash" component={SplashScreen} />
                <Drawer.Screen name="Home" component={HomeScreen}
                    options={() => ({
                        title: 'Productos',
                        headerTitleAlign: 'center',
                        headerShown: true,
                        unmountOnBlur: true,
                        swipeEnabled: true,
                        headerLeft: () => null
                    })}
                />
                <Drawer.Screen name="Cart" component={CartScreen}
                    options={({ navigation }) => ({
                        title: 'Detalle De La Compra',
                        headerTitleAlign: 'center',
                        headerShown: true,
                        headerLeft: () => (
                            <Icon
                                color={'#000000'}
                                size={8}
                                onPress={() => navigation.navigate('Home')}
                                as={<MaterialIcons name='chevron-left' />}
                                ml={3}
                            />
                        ),
                    })} />
                <Drawer.Screen name="Confirmation" component={ConfirmationScreen} />
            </Drawer.Navigator>

        </NavigationContainer>
    );
}

