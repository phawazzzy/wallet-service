import { Container } from 'inversify';
import TYPES from './config/types';
import { MongoDBDataSource } from './src/datasources/mongodb.datasource';
import { IDataSource } from './src/interfaces';
import { UserModel, OtpModel, WalletModel, WalletHistoryModel } from './src/models';
import { CrudRepository, IModelFactory, UserRepository, WalletHistoryRepository } from './src/repository';
import { OtpRepository } from './src/repository/otp.repository';
import { WalletRepository } from './src/repository/wallet.repository';
import { AirtimeToCashService } from './src/services/airtime-to-cash.service';
import { OtpService } from './src/services/otp.service';
import { UserService } from './src/services/user.service';
import { WalletHistoryService } from './src/services/wallet-history.service';
import { WalletService } from './src/services/wallet.service';

const container = new Container();
// Datasource
container.bind<CrudRepository>(TYPES.CrudRepository).to(CrudRepository);
container.bind<IDataSource>(TYPES.IDataSource).to(MongoDBDataSource);
container.bind<MongoDBDataSource>(TYPES.MongodbClient).to(MongoDBDataSource);

// REPOSITORY
container.bind<UserRepository>(TYPES.UserRepositry).to(UserRepository);
container.bind<OtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<WalletRepository>(TYPES.WalletRepository).to(WalletRepository);
container.bind<WalletHistoryRepository>(TYPES.WalletHistoryRepository).to(WalletHistoryRepository);

//SERVICE
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<OtpService>(TYPES.OtpService).to(OtpService);
container.bind<WalletService>(TYPES.WalletService).to(WalletService);
container.bind<WalletHistoryService>(TYPES.WalletHistoryService).to(WalletHistoryService);
container.bind<AirtimeToCashService>(TYPES.AirtimeToCashService).to(AirtimeToCashService);

//MODELS
container.bind<IModelFactory>(TYPES.IModelFactory).to(UserModel).whenTargetNamed('userModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(OtpModel).whenTargetNamed('otpModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(WalletModel).whenTargetNamed('walletModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(WalletHistoryModel).whenTargetNamed('walletHistoryModel');

export { container };
