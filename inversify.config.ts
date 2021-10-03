import { Container } from 'inversify';
import TYPES from './config/types';
import { MongoDBDataSource } from './src/datasources/mongodb.datasource';
import { IDataSource } from './src/interfaces';
import { UserModel, OtpModel, WalletModel, WalletHistoryModel } from './src/models';
import { CrudRepository, IModelFactory, UserRepository, WalletHistoryRepository } from './src/repository';
import { OtpRepository } from './src/repository/otp.repository';
import { WalletRepository } from './src/repository/wallet.repository';
import { OtpService } from './src/services/otp.service';
import { UserService } from './src/services/user.service';

const container = new Container();
// Datasource
container.bind<CrudRepository>(TYPES.CrudRepository).to(CrudRepository);
container.bind<IDataSource>(TYPES.IDataSource).to(MongoDBDataSource);
container.bind<MongoDBDataSource>(TYPES.MongodbClient).to(MongoDBDataSource);

// REPOSITORY
container.bind<UserRepository>(TYPES.UserRepositry).to(UserRepository);
container.bind<OtpRepository>(TYPES.OtpRepository).to(OtpRepository);
container.bind<WalletRepository>(TYPES.WalletRepository).to(WalletRepository);
container.bind<WalletHistoryRepository>(TYPES.WalletRepository).to(WalletHistoryRepository);

//SERVICE
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<OtpService>(TYPES.OtpService).to(OtpService);

//MODELS
container.bind<IModelFactory>(TYPES.IModelFactory).to(UserModel).whenTargetNamed('userModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(OtpModel).whenTargetNamed('otpModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(WalletModel).whenTargetNamed('walletModel');
container.bind<IModelFactory>(TYPES.IModelFactory).to(WalletHistoryModel).whenTargetNamed('walletHistoryModel');

export { container };
