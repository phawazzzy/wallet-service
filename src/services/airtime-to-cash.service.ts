import { InternalServerError } from 'http-errors';
import { inject, injectable } from 'inversify';
import TYPES from '../../config/types';
import { WalletService } from './wallet.service';

@injectable()
export class AirtimeToCashService {
    constructor(@inject(TYPES.WalletService) private _walletService: WalletService) {}

    async fundUserWallet(data: any) {
        const { amount, userId } = data;
        try {
            const fundWallet = await this._walletService.credit({ amount, userId, walletName: 'naira' }, 'airtime-to-cash');
            if (!fundWallet) {
                throw new InternalServerError('Unable to fund wallet');
            }
            return {
                status: true,
                statusCode: 201,
                message: 'User created succesfully',
                data: {},
                error: null
            };
        } catch (error: any) {
            return {
                status: false,
                statusCode: error.statusCode || error.status || 500,
                message: error.message || 'Internal server error',
                error
            };
        }
    }
}
