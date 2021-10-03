import { injectable } from 'inversify';
import mongoose, { Schema } from 'mongoose';
import { IModelFactory } from '../repository';

const walletSchema = new Schema(
    {
        userId: { type: String, required: true },
        walletName: { type: String, required: true, enum: ['naira', 'dollar', 'btc'] },
        amount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

@injectable()
export class WalletModel implements IModelFactory {
    model() {
        return mongoose.model('wallet', walletSchema);
    }
}
