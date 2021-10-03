import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import TYPES from '../../config/types';
import { WalletService } from '../services/wallet.service';
import { httpResponse } from '../helpers/httpResponse.helpers';

@controller('/api/v1/wallets')
export class WalletController {
    constructor(@inject(TYPES.WalletService) private service: WalletService) {}

    @httpGet('/:userId/:walletName')
    async getUserWalletDeatails(req: Request, res: Response) {
        const result = await this.service.fetchUserWalletDetails({ userId: req.params.userId, walletName: req.params.walletName });
        return httpResponse(res, result);
    }
}
