import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest, GetAllOrdersResponse, Order } from './interfaces/order';
import { InjectModel } from '@nestjs/sequelize';
import { OrderEntity } from './order.entity';
import { ClientGrpc } from '@nestjs/microservices';
import { Product, ProductServiceClient } from './interfaces/product';
import { OrderDto } from './dtos/order';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private productService: ProductServiceClient;

  constructor(
    @InjectModel(OrderEntity)
    private orderRepository: typeof OrderEntity,
    @Inject('PRODUCT_PACKAGE') private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceClient>('ProductService');
  }

  async create(request: CreateOrderRequest): Promise<Order> {
    if (request.orderProducts && request.orderProducts.length > 0) {
      const products: Product[] = [];
      const inventory: Map<string, number> = new Map<string, number>();

      for (const orderProduct of request.orderProducts) {
        const productId = { id: orderProduct.product };

        //Get product from Grpc ProductService
        const inventoryProduct = await firstValueFrom(
          this.productService.getProductById(productId)
        );

        if (orderProduct.qty < inventoryProduct.qty) {
          //To know then current inventory
          inventory.set(inventoryProduct.id, inventoryProduct.qty);

          inventoryProduct.qty = orderProduct.qty;
          products.push(inventoryProduct);
        }
      }

      if (products.length < request.orderProducts.length) {
        throw new BadRequestException('No enough inventory to place order');
      }

      //Save the order
      const order = await this.orderRepository.create({ products });

      //Update inventory
      for (const product of products) {
        product.qty = inventory.get(product.id) - product.qty;

        await firstValueFrom(
          this.productService.updateProduct({
            id: product.id,
            product: product
          })
        );
      }

      return new OrderDto(order);
    }

    throw new BadRequestException('No products to place order');
  }

  async getAllOrders(): Promise<GetAllOrdersResponse> {
    const orders = await this.orderRepository.findAll();
    return { orders: orders };
  }
}
