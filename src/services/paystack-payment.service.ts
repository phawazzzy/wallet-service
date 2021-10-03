import axios from 'axios';
import config from '../../config';

export interface InitializePayload {
    email: string;
    amount: number;
    metadata: { contractId?: string };
}

export interface VerifyPayload {
    reference: string;
    amount: number;
}
export class PaystackService {
    static async initializeTransaction(payload: InitializePayload) {
        const data = {
            ...payload,
            amount: payload.amount * 100
        };
        try {
            const URL = `https://api.paystack.co/transaction/initialize`;
            const options = {
                headers: {
                    authorization: `Bearer ${config.server.paystackSecret}`,
                    'Content-Type': 'application/json',
                    'cache-control': 'no-cache'
                }
            };

            const response = await axios.post(URL, data, options);
            if (!response) throw Error('Payment not initialized');
            return {
                data: response.data
            };
        } catch (error) {
            return {
                data: null,
                message: 'Not succesful'
            };
        }
    }

    static async verifyTransaction(payload: VerifyPayload) {
        try {
            const URL = `https://api.paystack.co/transaction/verify/${encodeURIComponent(payload.reference)}`;
            const options = {
                headers: {
                    authorization: `Bearer ${config.server.paystackSecret}`,
                    'Content-Type': 'application/json',
                    'cache-control': 'no-cache'
                }
            };

            const response = await axios.get(URL, options);
            const status = response.data.status;
            const mainStatus = response.data.data.status.toLowerCase();
            const charged_amount = response.data.data.amount / 515 / 100;
            return status === true && mainStatus === 'success' && charged_amount === payload.amount;
        } catch (error) {
            console.log(error);
        }
        return false;
    }
}
