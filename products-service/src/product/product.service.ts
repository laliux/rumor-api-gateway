import { Injectable } from '@nestjs/common';
import {
  CreateProductRequest,
  GetAllProductsResponse,
  ProductByIdRequest,
  UpdateProductRequest,
} from './product.interface';
import { InjectModel } from '@nestjs/sequelize';
import { ProductEntity } from './product.entity';
import { Product } from './product.interface';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductEntity)
    private productRepository: typeof ProductEntity,
  ) {}

  async createProduct(
    createProductRequest: CreateProductRequest,
  ): Promise<Product> {
    const product = await this.productRepository.create(
      createProductRequest as any,
    );

    return new ProductDto(product);
  }

  async getAllProducts(): Promise<GetAllProductsResponse> {
    const products = await this.productRepository.findAll();

    return { products: products };
  }

  async getProduct(request: ProductByIdRequest): Promise<Product> {
    const product = await this.productRepository.findByPk(request.id);

    return new ProductDto(product);
  }

  async deleteProduct(request: ProductByIdRequest): Promise<Product> {
    const product = await this.productRepository.findByPk(request.id);

    if (!product || !product.id) throw Error('Product to delete doesnt exist');

    await product.destroy();

    return new ProductDto(product);
  }

  async updateProduct(request: UpdateProductRequest): Promise<Product> {
    const product = await this.productRepository.findByPk(request.id);

    if (!product || !product.id) throw Error('Product to delete doesnt exist');

    product.name = request.product.name;
    product.description = request.product.description;
    product.price = request.product.price;
    product.qty = request.product.qty;

    await product.save();

    return new ProductDto(product);
  }
}
