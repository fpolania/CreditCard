import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image } from 'react-native';
import { Backdrop as BackdropComponent } from 'react-native-backdrop';
import { Button } from 'native-base';

const CustomBackdrop = ({ visible, handleOpen, handleClose, amount }: any) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [installments, setInstallments] = useState('1');
    const [identicationNumber, setIdentication] = useState('');
    const [error, setError] = useState('');
    const [cardLogo, setCardLogo] = useState('');

    const detectCardType = (number: string) => {
        if (number.startsWith('4') && number.length === 16) {
            return 'VISA';
        } else if (/^5[1-5]/.test(number) && number.length === 16) {
            return 'MasterCard';
        } else {
            return '';
        }
    };

    const validateCard = () => {
        const cardType = detectCardType(cardNumber.replace(/-/g, ''));
        if (!cardType) {
            setError('Invalid card number');
            setCardLogo('');
            return false;
        }

        setCardLogo(cardType);
        setError('');
        return true;
    };
    const isFormValid = (
        cardNumber !== '' &&
        expirationDate !== '' &&
        cvv !== '' &&
        cardHolder !== '' &&
        installments !== '' &&
        identicationNumber !== '' &&
        error === ''
    );
    const handleSubmit = () => {
        if (validateCard()) {
            alert('Tarjeta validada y datos enviados');
        }
    };

    /**
     *Le da formato al dato entrada para el campo CardNumber
     *ejemplo 1111-3333-2233
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
        if (value.length < cardNumber.length) {
            setCardNumber(value);
            setError('Debe tener 16 dígitos')
        } else {
            const formatted = formatCardNumber(value);
            setCardNumber(formatted);
            setError('')
        }
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
                <Text style={styles.title}>Información De La Tarjeta</Text>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/descarga.jpg')}
                        style={styles.logo}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    value={cardNumber}
                    onChangeText={handleInputChange}
                    keyboardType="numeric"
                    placeholder="Número de la tarjeta"
                    maxLength={19}
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="MM/YY"
                        keyboardType="numeric"
                        maxLength={5}
                        value={expirationDate}
                        onChangeText={handleInputChangeDate}
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="CVV"
                        keyboardType="numeric"
                        maxLength={3}
                        value={cvv}
                        onChangeText={(text) => handleCard(text)}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre en la tarjeta"
                    value={cardHolder}
                    onChangeText={(text) => handleCardHolderChange(text)}
                />
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Número De Cuotas"
                        keyboardType="numeric"
                        maxLength={2}
                        value={installments}
                        onChangeText={handleInstallmentsChange}
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        placeholder="Número Identificación"
                        keyboardType="numeric"
                        maxLength={10}
                        value={identicationNumber}
                        onChangeText={handleInputChangeIdentication}
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
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
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
        width: '100%',
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 50,
    },
    halfInput: {
        width: '48%',
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
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00C853',
        marginBottom: 10
    },
});

export default CustomBackdrop;
