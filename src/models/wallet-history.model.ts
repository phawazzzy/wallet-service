import { injectable } from 'inversify';
import mongoose, { Schema } from 'mongoose';
import { IModelFactory } from '../repository';

const walletHistorySchema = new Schema(
    {
        userId: { type: String, required: true },
        walletName: { type: String, required: true, enum: ['naira', 'dollar', 'btc'] },
        amount: { type: Number, default: 0 },
        previousTotal: { type: Number, required: true },
        type: { type: String, enum: ['credit', 'debit'], required: true },
        caller: { type: String, enum: ['airtime-to-cash', 'transfer', 'withdraw', 'failed-withdraw-refund', 'top-up'], required: true }
    },
    { timestamps: true }
);

@injectable()
export class WalletHistoryModel implements IModelFactory {
    model() {
        return mongoose.model('walletHistory', walletHistorySchema);
    }
}
