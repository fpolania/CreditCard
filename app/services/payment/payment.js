

export const createPaymentIntent = async (dataPayment) => {
    try {
        
        /** @type {*} se multiplica el valor por 100000 por que api espera un monto mayor 50 centavos  */
        const amountInCents = Math.round(parseFloat(dataPayment.amount) * 100000);
        const paymentMethodMap = {
            'Visa': 'pm_card_visa',
            'MasterCard': 'pm_card_mastercard',
        };
        const selectedPaymentMethod = paymentMethodMap[dataPayment.cardType] || 'pm_card_visa';
        const response = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer sk_test_CGGvfNiIPwLXiDwaOfZ3oX6Y',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                amount: amountInCents.toString(),
                currency: 'COP',
                payment_method: selectedPaymentMethod,
                'payment_method_types[]': 'card',
            }).toString(),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creando el pago:', error);
    }
};
