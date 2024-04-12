import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
//import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderModule } from './order/order.module';
import { dataBaseConfig } from './database/database.config';

@Module({
  imports: [OrderModule, SequelizeModule.forRoot(dataBaseConfig)],
  controllers: [],
  providers: []
})
export class AppModule {}
