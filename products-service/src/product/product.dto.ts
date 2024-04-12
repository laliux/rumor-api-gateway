import { Product } from './product.interface';
import { ProductEntity } from './product.entity';

export class ProductDto implements Product {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.qty = product.qty;
  }
}
