import { InternalServerError } from 'http-errors';
import { inject, injectable } from 'inversify';
import logging from '../../config/logging';
import TYPES from '../../config/types';
import { WalletRepository } from '../repository/wallet.repository';
import { IWalletHistory, WalletHistoryService } from './wallet-history.service';

const NAMESPACE = 'wallet-service';
export interface Iwallet {
    walletName: string;
    userId: string;
}

export interface IWalletData {
    userId: string;
    amount: number;
    walletName: string;
}
//TODO: credit and debit should be transactions taking other atomic operations as parameters
// TODO: check for all forms of negative bugs
@injectable()
export class WalletService {
    constructor(@inject(TYPES.WalletRepository) private _repo: WalletRepository, @inject(TYPES.WalletHistoryService) private _walletHistoryService: WalletHistoryService) {}

    async init(data: Iwallet) {
        return await this._repo.create({ userId: data.userId, walletName: data.walletName, amount: 0 });
    }

    async credit(data: IWalletData, caller: string) {
        try {
            const { userId, walletName } = data;
            const currentWallet = await this.fetch({ userId, walletName });
            const amount = parseFloat(data.amount.toString());
            const history = await this._walletHistoryService.create({
                userId: data.userId,
                amount,
                caller,
                type: 'credit',
                previousTotal: currentWallet.amount,
                walletName
            });

            if (history) {
                const record = await this._repo.updateWallet({ userId, amount, walletName });
                if (!record) throw Error('Could not credit user');
                return record;
            }
        } catch (error) {
            logging.error(NAMESPACE, 'wallet crediting didnt happen', error);
        }
        throw Error('Could not credit user');
    }

    async debit(data: IWalletData, caller: string) {
        try {
            const { userId, walletName } = data;
            const currentWallet = await this.fetch({ userId, walletName });

            const amount = -1 * parseFloat(data.amount.toString());
            const history = await this._walletHistoryService.create({
                userId: data.userId,
                amount,
                caller,
                type: 'debit',
                previousTotal: currentWallet.amount,
                walletName
            });
            if (history) {
                const record = await this._repo.updateWallet({ userId, amount, walletName });
                if (!record) throw Error('Could not debit user');
                return record;
            } else "can't create wallet history";
        } catch (error) {}
        throw Error('Could not debit user');
    }

    async fetch(data: { userId: string; walletName: string }) {
        try {
            const { userId, walletName } = data;
            const wallet = await this._repo.findOne({ userId, walletName });
            if (!wallet) return this.init(data);
            return wallet;
        } catch (error) {
            console.log(error);
            throw Error('Error fetching wallet');
        }
    }

    async get(data: Iwallet): Promise<{ userId: string; amount: number } | any> {
        try {
            const { userId, walletName } = data;
            const response = await this._repo.findOne({ userId, walletName });
            if (response)
                return {
                    data: { userId: response.userId, amount: response.amount, walletName: response.walletName },
                    message: 'Wallet fetched successfully'
                };
        } catch (error) {}

        return {
            data: null,
            error: 'Failed to fetch wallet'
        };
    }

    async hasEnoughBalance(data: Iwallet, value: number): Promise<boolean> {
        const { userId, walletName } = data;
        const currentWallet = await this.get({ userId, walletName });
        const amount = parseFloat(currentWallet.amount.toString());
        return amount >= value;
    }

    async fundWallet() {
        try {
            // get the wallet
        } catch (error) {}
    }

    async fetchUserWalletDetails(data: Iwallet) {
        try {
            const wallet = await this.get({ userId: data.userId, walletName: data.walletName });
            if (!wallet) {
                throw new InternalServerError('wallet not fetched');
            }
            return {
                status: true,
                statusCode: 201,
                message: 'User naira credited succesfully',
                data: wallet,
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
