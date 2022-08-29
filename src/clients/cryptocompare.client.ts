import * as config from '../configs/index.config';
import axios from 'axios';

const CURRENCY_USD = 'USD';
const DIGITS_AFTER_DECIMAL = 6;

const cryptoCompareClient = axios.create({
    baseURL: `${config.default.cryptocompare.baseUrl}?api_key=${config.default.cryptocompare.token}`,
    timeout: config.default.cryptocompare.timeout,
});

export const convertCryptoToUSD = async (cryptoToken?: string, value?: number) => {
    try {
        const { data } = await cryptoCompareClient.get('', {
            params: {
                fsym: cryptoToken,
                tsyms: CURRENCY_USD
            }
        });
        const convertedValue = parseFloat(data[CURRENCY_USD]) * value;

        console.log(convertedValue);

        return convertedValue.toFixed(DIGITS_AFTER_DECIMAL);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            return error.message;
        } else {
            console.log('unexpected error: ', error);
            return 'An unexpected error occurred';
        }
    }
}
