import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import TYPES from '../../config/types';
import { httpResponse } from '../helpers/httpResponse.helpers';
import { AirtimeToCashService } from '../services/airtime-to-cash.service';

@controller('/api/v1/airtime-to-cash')
export class airtimeToCashController {
    constructor(@inject(TYPES.AirtimeToCashService) private airtimeToCashService: AirtimeToCashService) {}

    // get wallet

    // top-up user wallet for airtime to cash
    @httpPost('/top-up')
    async airtimeTopUp(req: Request, res: Response) {
        const result = await this.airtimeToCashService.fundUserWallet(req.body);
        return httpResponse(res, result);
    }
}
