import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderEntity } from './order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderEntity]),
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: 'products:5000',
          package: 'orders',
          protoPath: '../grpc/product.proto'
        }
      }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
