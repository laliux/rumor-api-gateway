import { OrderEntity } from '../order.entity';
import { Order } from '../interfaces/order';
import { Product } from '../interfaces/product';

export class OrderDto implements Order {
  id: string;
  products: Product[];

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.products = order.products;
  }
}
