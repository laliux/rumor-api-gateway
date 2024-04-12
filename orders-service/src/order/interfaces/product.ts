/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product";

/** Define the Product message */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  qty: number;
}

/** Request message to get and delete a product by ID */
export interface ProductByIdRequest {
  id: string;
}

/** Request message to update a product */
export interface UpdateProductRequest {
  id: string;
  product: Product | undefined;
}

export interface GetAllProductsRequest {
}

/** Response message containing all products */
export interface GetAllProductsResponse {
  products: Product[];
}

export const PRODUCT_PACKAGE_NAME = "product";

/** Define the service for CRUD operations on products */

export interface ProductServiceClient {
  /** Create a new product */

  createProduct(request: CreateProductRequest): Observable<Product>;

  /** Get a product by ID */

  getProductById(request: ProductByIdRequest): Observable<Product>;

  /** Update a product */

  updateProduct(request: UpdateProductRequest): Observable<Product>;

  /** Delete a product by ID */

  deleteProductById(request: ProductByIdRequest): Observable<Product>;

  /** Get all products */

  getAllProducts(request: GetAllProductsRequest): Observable<GetAllProductsResponse>;
}

/** Define the service for CRUD operations on products */

export interface ProductServiceController {
  /** Create a new product */

  createProduct(request: CreateProductRequest): Promise<Product> | Observable<Product> | Product;

  /** Get a product by ID */

  getProductById(request: ProductByIdRequest): Promise<Product> | Observable<Product> | Product;

  /** Update a product */

  updateProduct(request: UpdateProductRequest): Promise<Product> | Observable<Product> | Product;

  /** Delete a product by ID */

  deleteProductById(request: ProductByIdRequest): Promise<Product> | Observable<Product> | Product;

  /** Get all products */

  getAllProducts(
    request: GetAllProductsRequest,
  ): Promise<GetAllProductsResponse> | Observable<GetAllProductsResponse> | GetAllProductsResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createProduct",
      "getProductById",
      "updateProduct",
      "deleteProductById",
      "getAllProducts",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
