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
@injectable()
export class WalletService {
    constructor(@inject(TYPES.WalletRepository) private _repo: WalletRepository, @inject(TYPES.WalletHistoryService) private _walletHistoryService: WalletHistoryService) {}

    async init(data: Iwallet) {
        return await this._repo.create({ userId: data.userId, walletName: data.walletName, amount: 0 });
    }

    async credit(data: IWalletHistory, caller: string) {
        try {
            const { userId, walletName } = data;
            const currentWallet = await this.get({ userId, walletName });
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
                    data: { userId: response.userId, amount: response.amount },
                    message: 'Wallet fetched successfully'
                };
        } catch (error) {}

        return {
            data: null,
            error: 'Failed to fetch wallet'
        };
    }
}
