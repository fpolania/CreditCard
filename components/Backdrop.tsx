import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { Backdrop as BackdropComponent } from 'react-native-backdrop';
import { Button, Icon, Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Product } from '@/app/interfaces/product-interface';
import { createPaymentIntent } from './../app/services/payment/payment';
import Spinner from "react-native-loading-spinner-overlay";

type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Cart: { selectedProducts: Product[] };
    Confirmation: { dataClient: any }
};

type ConfirmationcreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;





const CustomBackdrop = ({ visible, handleOpen, handleClose, amount, units }: any) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [installments, setInstallments] = useState('1');
    const [identicationNumber, setIdentication] = useState('');
    const [error, setError] = useState('');
    const [cardType, setCardType] = useState('');
    const navigation = useNavigation<ConfirmationcreenNavigationProp>();
    const [spinner, setSpinner] = useState(false);

    /** @type {*}  Valida que el formulario sea valido*/
    const isFormValid = (
        cardNumber !== '' &&
        expirationDate !== '' &&
        cvv !== '' &&
        cardHolder !== '' &&
        installments !== '' &&
        identicationNumber !== '' &&
        error === ''
    );

    /**
     *Realiza el pago y nevagea a la pantalla de confirmacíon,
     *
     */
    const handleSubmit = async () => {
        setSpinner(true);
        let data = {
            amount: amount,
            units: units,
            person: cardHolder,
            cardType: cardType,
            cardNumber: cardNumber,
            document: identicationNumber
        }
        const response = await createPaymentIntent(data);
        setSpinner(false);
        if (response?.amount) {
            navigation.navigate('Confirmation', { dataClient: data })
        } else if (response?.error) {
            Alert.alert(response?.error?.code, response?.error?.message);
        }
    };

    /**
     *Le da formato al dato entrada para el campo CardNumber
     *ejemplo 1111-3333-2233-3423
     * @param {string} input
     * @return {*} 
     */
    const formatCardNumber = (input: string) => {
        const sanitized = input.replace(/-/g, '');
        const trimmed = sanitized.slice(0, 16);
        return trimmed.replace(/(.{4})/g, '$1-').slice(0, 19);
    };

    /**
     * Valida que el dato de entrada sea menor al cardNumber para setear el valor,
     * si no es mayor entrega el dato con el formato.
     * @param {string} value
     */
    const handleInputChange = (value: string) => {
        const rawValue = value.replace(/-/g, '');
        const isDeleting = value.length < cardNumber.length;
        const updatedValue = isDeleting ? value : formatCardNumber(rawValue);
        detectCardType(updatedValue);
        setCardNumber(updatedValue);
        validateCardNumber(rawValue);
    };

    /**
     * Valida que tipo de tarjeta es, para mostrar la imagen.
     *
     * @param {string} number
     */
    const detectCardType = (number: string) => {
        const firstDigit = number.charAt(0);
        const type = firstDigit === '5' ? 'MasterCard' : 'Visa';
        setCardType(type)
    };

    /**
     *Valida la cantidad de digitos en el campo CardNumber.
     *
     * @param {string} value
     */
    const validateCardNumber = (value: string) => {
        if (value.charAt(0) === '0') {
            setError('Debe ser mayor a cero');
            return;
        }
        setError(value.length === 16 ? '' : 'Debe tener 16 dígitos');
    };




    const handleInputChangeDate = (text: string) => {
        const formatted = formatExpirationDate(text);
        setExpirationDate(formatted);
    };

    /**
     *le da el siguiente formato MM/YY al dato de entrada.
     *
     * @param {string} input
     * @return {*} 
     */
    const formatExpirationDate = (input: string) => {
        const sanitized = input.replace(/[^0-9]/g, '');
        const trimmed = sanitized.slice(0, 4);
        if (trimmed.length > 2) {
            setError('');
            return `${trimmed.slice(0, 2)}/${trimmed.slice(2)}`;
        } else {
            setError('Formato de fecha inválido. Debe ser MM/AA')
        }
        return trimmed;
    };

    /**
     *Valida que el campo tenga minimo 7 digitos.
     *
     * @param {*} inputValue
     */
    const handleInputChangeIdentication = (inputValue) => {
        const numericValue = inputValue.replace(/[^0-9]/g, '');

        if (numericValue.length <= 10) {
            setIdentication(numericValue);
            setError('')
        }
        if (numericValue.length < 7) {
            setError('Debe tener al menos 7 dígitos.')
        }
    };

    /**
     *valida que el campo tenga un valor mayor a cero.
     *
     * @param {*} inputValue
     */
    const handleInstallmentsChange = (inputValue) => {
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        if (numericValue.length === 1 && parseInt(numericValue) <= 0) {
            setError('Debe ser mayor que cero.');
        } else {
            setError('');
        }
        if (numericValue.length <= 2) {
            setInstallments(numericValue);
        }
    };
    /**
     * Elimina caracteres que no correspondan al nombre, que no esta vacio
     * Valida que no tenga espacios en blanco
     * @param {*} text
     */
    const handleCardHolderChange = (text) => {
        const sanitizedText = text.replace(/[^a-zA-Z\s]/g, '').replace(/\s{2,}/g, ' ');
        if (sanitizedText.length === 0) {
            setError('El nombre no puede estar vacío y debe contener solo letras.');
        } else if (/[^a-zA-Z\s]/g.test(text)) {
            setError('Solo se permiten letras y un espacio entre nombre y apellido.');
        } else {
            setError('');
        }

        setCardHolder(sanitizedText);
    };

    /**
     *Elimina caracteres No numericos, valida que si tenga 3 digitos.
     *
     * @param {string} text
     */
    const handleCard = (text: string) => {
        const sanitized = text.replace(/[^0-9]/g, '');
        if (sanitized.length <= 3) {
            setCvv(sanitized);
        }
        if (sanitized.length > 0 && sanitized.length < 3) {
            setError('El CVV debe tener al menos 3 dígitos');
        } else {
            setError('');
        }
    };


    return (
        <>
            <BackdropComponent
                visible={visible}
                handleOpen={handleOpen}
                handleClose={handleClose}
                onClose={handleClose}
                swipeConfig={{
                    velocityThreshold: 0.3,
                    directionalOffsetThreshold: 80,
                }}
                animationConfig={{
                    speed: 14,
                    bounciness: 4,
                }}
                overlayColor="rgba(0,0,0,0.32)"
                backdropStyle={{
                    backgroundColor: '#fff',
                }}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>INFORMACIÓN DE LA TARJETA</Text>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/descarga.jpg')}
                            style={styles.logo}
                        />
                    </View>

                    <Input
                        value={cardNumber}
                        onChangeText={handleInputChange}
                        keyboardType="numeric"
                        placeholder="Número de la tarjeta"
                        maxLength={19}
                        InputRightElement={
                            <Image
                                source={
                                    cardType === 'Visa' ?
                                        require('../assets/images/visa.png')
                                        : require('../assets/images/mastercard.png')
                                }
                                style={styles.imageTypeCard}
                            />
                        }
                        borderRadius={50}
                        style={styles.input}
                    />

                    <View style={styles.row}>
                        <Input
                            value={expirationDate}
                            onChangeText={handleInputChangeDate}
                            keyboardType="numeric"
                            placeholder="MM/YY"
                            maxLength={5}
                            InputRightElement={
                                <Icon as={<Ionicons name="calendar" />} size={5} ml={1} right={2} color="orange.500" />
                            }
                            borderRadius={50}
                            style={[styles.input]}
                            width={'45%'}
                        />
                        <Input
                            value={cvv}
                            onChangeText={(text) => handleCard(text)}
                            keyboardType="numeric"
                            placeholder="CVC"
                            maxLength={3}
                            InputRightElement={
                                <Icon as={<Ionicons name="key-sharp" />} size={5} ml={1} right={2} color="orange.500" />
                            }
                            borderRadius={50}
                            style={styles.input}
                            width={'45%'}
                        />
                    </View>
                    <Input
                        value={cardHolder}
                        onChangeText={(text) => handleCardHolderChange(text)}
                        keyboardType="default"
                        placeholder="Nombre en la tarjeta"
                        InputRightElement={
                            <Icon as={<Ionicons name="person-circle" />} size={5} ml={1} right={2} color="orange.500" />
                        }
                        borderRadius={50}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <Input
                            value={installments}
                            onChangeText={handleInstallmentsChange}
                            keyboardType="numeric"
                            placeholder="Cuotas"
                            maxLength={2}
                            InputRightElement={
                                <Icon as={<Ionicons name="stats-chart" />} size={5} ml={1} right={2} color="orange.500" />
                            }
                            borderRadius={50}
                            style={styles.input}
                            width={'35%'}
                        />
                        <Input
                            value={identicationNumber}
                            onChangeText={handleInputChangeIdentication}
                            keyboardType="numeric"
                            placeholder="Número Identificación"
                            maxLength={10}
                            InputRightElement={
                                <Icon as={<Ionicons name="card" />} size={5} ml={1} right={2} color="orange.500" />
                            }
                            borderRadius={50}
                            style={styles.input}
                            width={'60%'}
                        />
                    </View>
                    {error && <Text style={styles.error}>{error}</Text>}
                    <View style={styles.card}>
                        <Text style={styles.title}>TOTAL</Text>
                        <Text style={styles.amount}>$ {amount} </Text>
                        <Button color={"black"} disabled={!isFormValid} borderRadius={30} onPress={handleSubmit} >
                            PAGAR
                        </Button>
                    </View>
                </View>
            </BackdropComponent>
            {spinner && (
                <Spinner
                    visible={spinner}
                    textContent={"Validando información..."}
                    textStyle={{ color: "#FF7423" }}
                    overlayColor="rgba(0, 0, 0, 0.5)"
                    size={100}
                    color="#FF7423"
                    animation="fade"
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
        top: 7
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        height: 48,
        borderRadius: 100,
        fontSize: 16,

    },

    cardLogo: {
        width: 50,
        height: 30,
        marginVertical: 10,
    },
    error: {
        color: 'red',
        marginBottom: 20,
        fontWeight: 'bold',
        top: 10
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: 70,
        marginHorizontal: 10,
        resizeMode: 'contain',
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
        top: 15
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 10
    },
    imageTypeCard: {
        width: 24,
        height: 24,
        marginRight: 10,
    }
});

export default CustomBackdrop;

