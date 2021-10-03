import { inject, injectable } from 'inversify';
import TYPES from '../../config/types';
import { WalletHistoryRepository } from '../repository';

export interface IWalletHistory {
    amount: number;
    userId: string;
    caller: string;
    type: string;
    previousTotal: number;
    walletName: string;
}

@injectable()
export class WalletHistoryService {
    constructor(@inject(TYPES.WalletHistoryRepository) private _repo: WalletHistoryRepository) {}

    async create(data: IWalletHistory) {
        try {
            const response = await this._repo.create({
                userId: data.userId,
                amount: data.amount,
                caller: data.caller,
                type: data.type,
                previousTotal: data.previousTotal,
                walletName: data.walletName
            });
            return response != undefined;
        } catch (error) {
            console.log('History error');

            console.log(error);

            return false;
        }
    }
}
