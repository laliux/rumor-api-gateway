import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateProductRequest,
  GetAllProductsResponse,
  Product,
  ProductByIdRequest,
  ProductServiceController,
  UpdateProductRequest,
} from './product.interface';
import { ProductService } from './product.service';

@Controller()
export class ProductController implements ProductServiceController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'GetProductById')
  getProductById(request: ProductByIdRequest): Promise<Product> {
    return this.productService.getProduct(request);
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  updateProduct(request: UpdateProductRequest): Promise<Product> {
    return this.productService.updateProduct(request);
  }

  @GrpcMethod('ProductService', 'DeleteProductById')
  deleteProductById(request: ProductByIdRequest): Promise<Product> {
    return this.productService.deleteProduct(request);
  }

  @GrpcMethod('ProductService', 'CreateProduct')
  createProduct(createProductRequest: CreateProductRequest): Promise<Product> {
    return this.productService.createProduct(createProductRequest);
  }

  @GrpcMethod('ProductService', 'GetAllProducts')
  getAllProducts(): Promise<GetAllProductsResponse> {
    return this.productService.getAllProducts();
  }
}
