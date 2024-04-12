/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Product } from './product';

export const protobufPackage = 'orders';

export interface OrderProduct {
  product: string;
  qty: number;
}

export interface Order {
  id: string;
  products: Product[];
}

export interface CreateOrderRequest {
  orderProducts: OrderProduct[];
}

export interface GetAllOrdersRequest {}

export interface GetAllOrdersResponse {
  orders: Order[];
}

export const ORDERS_PACKAGE_NAME = 'orders';

export interface OrderServiceClient {
  createOrder(request: CreateOrderRequest): Observable<Order>;

  getAllOrders(request: GetAllOrdersRequest): Observable<GetAllOrdersResponse>;
}

export interface OrderServiceController {
  createOrder(request: CreateOrderRequest): Promise<Order> | Observable<Order> | Order;

  getAllOrders(
    request: GetAllOrdersRequest
  ):
    | Promise<GetAllOrdersResponse>
    | Observable<GetAllOrdersResponse>
    | GetAllOrdersResponse;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createOrder', 'getAllOrders'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod('OrderService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod('OrderService', method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const ORDER_SERVICE_NAME = 'OrderService';
