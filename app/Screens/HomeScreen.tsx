import React, { useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    Image, TouchableOpacity, Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { getProducts } from '../services/backend/products';
import { Icon } from 'native-base';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Product } from '../interfaces/product-interface';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, removeProduct, setProducts } from '../redux/actions';


export const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const products = useSelector((state: any) => state.products);
    const selectedProducts = useSelector((state: any) => state.selectedProducts);
    const cartCount = selectedProducts.length;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getProducts();
            dispatch(setProducts(response));
        };

        fetchData();
    }, [dispatch]);

    /**
     * agrega o elimina elementos seleccionado utilizando redux.
     *
     * @param {Product} product
     */
    const toggleSelection = (product: Product) => {
        const isAlreadySelected = selectedProducts.some(item => item.id === product.id);
        if (isAlreadySelected) {
            dispatch(removeProduct(product.id));
        } else {
            dispatch(addProduct(product));
        }
    };

    /**
     *navega a la pantalla CartScreen y le pasa los elementos seleccionados.
     *
     */
    const handleBuy = () => {
        if (selectedProducts.length === 0) {
            Alert.alert('No hay productos seleccionados', 'Por favor, seleccione al menos un producto para comprar.');
        } else {
            navigation.navigate("Cart" as never);
        }
    };

    /**
     *renderiza los productos obtenidos del servicio.
     *
     * @param {{ item: Product }} { item }
     */
    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
            />
            <Text style={styles.productName}>{item.title}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity id='buy-button'
                style={styles.selectButton}
                onPress={() => toggleSelection(item)}
            >
                <Text style={styles.selectButtonText}>
                    {selectedProducts.some(product => product.id === item.id) ? 'Quitar' : 'Agregar'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
                <Icon
                    color="white"
                    size={30}
                    as={<MaterialIcons name="shopping-cart" />}
                    ml={1}
                />
                {cartCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },
    productCard: {
        backgroundColor: '#ffffff',
        padding: 25,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'contain',

    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 14,
        color: '#6c757d',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#28a745',
    },
    selectButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buyButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#28a745',
        paddingVertical: 15,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

