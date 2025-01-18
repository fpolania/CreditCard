import { View, StyleSheet } from 'react-native';
import { Text, Image, Button } from 'native-base';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { clearCreditCardData, clearSelectedProducts } from '../redux/actions';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { decryptedData } from '../crypto/crypto';


const ConfirmationScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [dateNow, setDate] = useState(new Date());
    const encryptedData = useSelector((state: any) => state.encryptedCardData);

    const decryptedDataItem = useMemo(() => {
        if (!encryptedData) {
            return null;
        }
        const data = decryptedData(encryptedData);
        return data;
    }, []);

    const { amount, units, person, cardType, cardNumber, document } = decryptedDataItem;

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    });


    useEffect(() => {
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    /**
     *Le da formato a la fecha.
     *
     * @param {*} date
     * @return {*} 
     */
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };
    const handleSubmitHome = () => {
        dispatch(clearSelectedProducts());
        dispatch(clearCreditCardData());
        navigation.navigate('Home' as never);
    };
    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 20,
            }}>
                <Image
                    source={require('../../assets/images/check.png')}
                    alt="image-profile"
                    style={{ width: 100, height: 100, borderRadius: 8 }}
                    resizeMode="contain"
                />
            </View>
            <Text fontSize="32" textAlign={'center'} lineHeight={45} color="#000000" bold numberOfLines={2}>
                Pago Aceptado
            </Text>
            <Text fontSize="16" textAlign={'center'} lineHeight={26} fontWeight={600} color="#666666" numberOfLines={2}>
                ¡Gracias por tu compra! Tu pedido está en camino.
            </Text>
            <View style={styles.card}>
                <View style={{ alignItems: 'flex-start' }}>
                    <Text color={'amber.500'} bold >Comprobante NO, 00001212</Text>
                    <Text color={'cyan.700'} bold>{formatDate(dateNow)} </Text>
                </View>
                <View style={styles.hr} />
                <View style={{ alignItems: 'flex-start' }}>
                    <Text color={'#666666'} bold fontSize={16}>CANTIDAD DE PRODUCTOS: {units} </Text>
                    <Text color={'emerald.600'} bold fontSize={16} >TOTAL PAGADO: $ {amount} </Text>
                    <Text color={'#666666'} bold fontSize={16}>NOMBRE: {person.toUpperCase()} </Text>
                    <Text color={'#666666'} bold fontSize={16}>IDENTIFICACIÓN: {document} </Text>
                    <Text color={'#666666'} bold fontSize={16}>TIPO DE PAGO: TARJETA {cardType.toUpperCase()} </Text>
                    <Text color={'#666666'} bold fontSize={16}>TARJETA: {'*'.repeat(cardNumber.length - 4) + cardNumber.slice(-4)} </Text>
                </View>
                <Button style={{ backgroundColor: '#FFE9E2', borderRadius: 30, top: 20 }} borderRadius={30} onPress={() => handleSubmitHome()} >
                    <Text color={'#FF7423'} bold fontSize={16} lineHeight={22}
                        fontWeight={500}> Volver al Inicio</Text>
                </Button>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
        height: '45%'
    },
    hr: {
        width: '100%',
        height: 2,
        backgroundColor: '#000000',
        marginVertical: 15,
    },
})
export default ConfirmationScreen;