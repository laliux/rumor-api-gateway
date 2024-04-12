import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { dataBaseConfig } from './database/database.config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [ProductModule, SequelizeModule.forRoot(dataBaseConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
