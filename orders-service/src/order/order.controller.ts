import { Controller } from '@nestjs/common';
//import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order.service';
import {
  CreateOrderRequest,
  GetAllOrdersResponse,
  Order,
  OrderServiceController
} from './interfaces/order';
import { GrpcMethod } from '@nestjs/microservices';
//import { CreateOrderDto } from './dto/create-order.dto';
//import { UpdateOrderDto } from './dto/update-order.dto';

@Controller()
export class OrderController implements OrderServiceController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  createOrder(request: CreateOrderRequest): Promise<Order> {
    return this.orderService.create(request);
  }

  @GrpcMethod('OrderService', 'GetAllOrders')
  getAllOrders(): Promise<GetAllOrdersResponse> {
    return this.orderService.getAllOrders();
  }
}
