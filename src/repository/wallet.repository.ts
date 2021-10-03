import { inject, injectable, named } from 'inversify';
import { CrudRepository } from '.';
import TYPES from '../../config/types';
import { MongoDBDataSource } from '../datasources/mongodb.datasource';
import { WalletModel } from '../models';

export interface ICreditObject {
    userId: string;
    amount: number;
    walletName: string;
}
@injectable()
export class WalletRepository extends CrudRepository {
    constructor(@inject(TYPES.IDataSource) dbClient: MongoDBDataSource, @inject(TYPES.IModelFactory) @named('walletModel') modelFactory: WalletModel) {
        super(dbClient, modelFactory);
    }
    async updateWallet(data: ICreditObject) {
        try {
            const response = await this.modelObject().findOneAndUpdate({ userId: data.userId, walletName: data.walletName }, { $inc: { amount: data.amount } });
            return response != undefined;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
