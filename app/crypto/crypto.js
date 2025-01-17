var CryptoJS = require("crypto-js");
const SECRET_KEY = 'c879fcd34e6e6aab1bb82ebb6824d333';

/**
 *cifra los datos de la tarjeta.
 *
 * @param {*} data
 * @return {*} 
 */
const encryptData = (data) => {
    try {
        const jsonData = JSON.stringify(data);
        const ciphertext = CryptoJS.AES.encrypt(jsonData, SECRET_KEY).toString();
        return ciphertext;
    } catch (error) {
        console.error('Error al cifrar los datos:', error);
    }
};


/**
 * Descifra los datos de la tarjeta.
 *
 * @param {*} ciphertext
 * @return {*} 
 */
const decryptedData = (ciphertext) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

export { encryptData, decryptedData };
