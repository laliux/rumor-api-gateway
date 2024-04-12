# Rumor Microservices
The code presented here is part of a technical test to evaluate my proficiency in designing and implementing microservices architectures using gRPC, Nest.JS, and Golang.

### Requirements

1. Product Service (Nest.JS):
    - [x] Implement CRUD operations for products (Create, Read, Update, Delete).
    - [x] Each product should have at least a name, description, price and available quantity.

2. Order Service (Nest.JS):
    - [x] Implement functionality to place an order. An order should reference one or more products and specify the quantities.
    - [x] Implement a simple order listing functionality, which returns a list of all orders with product details.
    - [x] Implement an interservice call to Product service using gRPC to ensure that the product exists and has quantity available.

3. API Gateway (Golang):
    - [x] Develop an API Gateway that exposes REST endpoints for the functionalities of the Product and Order Services. 
    - [x] Implement JWT authentication to secure the endpoints. 
    - [ ] Add a rate-limiting feature to protect the services from overuse (Bonus).

4. gRPC:
    - [x] Define gRPC protocols in a separate project.
    - [x] Make sure to compile these and include them in respective projects as compiled gRPC protocols.

5. gRPC Communication:
    - [x] Establish gRPC communication between the microservices and the API Gateway.
    - [x] Define the necessary Protobuf messages and services for the operations above.

6. Unit Tests:
    - [ ] Write unit tests for the business logic of your application, including the data fetching and parsing logic.

7. Bonus - Unit Tests (Optional):
    - [ ] Write unit tests for Product and Order microservices to test business logic.

8. Docker
    - [x] Containerize the Product Service, Order Service, and API Gateway.
    - [x] Provide a Docker Compose file to orchestrate the startup of the entire system.

9. Documentation _Pending_

### Code
This repo contains the following folders:

- 📁 grpc - Definition of gRPC protocols
- 📁 products-service - Nestjs implementation of the gRPC service to manage products
- 📁 orders-service - Nestjs implementation of the gRPC service to place and query orders
- 📁 api-gateway - Golang implementation of an API gateway to serve the gRPC services

The main folder contains the docker and docker-compose files to build the projects.

### How to test
Just clone this repo and run the following:

```
docker compose build
docker compose up
```

After that you will have the API gateway running in port 8080 and you can start sending some HTTP requests.

**/products** expose all the endpoints in products service.
**/orders** expose all the endpoints in order service.

Additionally, the **/login** endpoint is provided to get a JWT token. This token is necessary to call the /products and /orders endpoints.

#### Get a JWT
The credentials to get a JWT token are hardcoded. The username=hello and password=123.

Important: JWT token will be truncated for documentation purposes, be sure to use the full token returned by /login endpoint.

```
curl -X POST http://localhost:8080/login -H 'Content-Type: application/json' -d '{"Username": "hello", "Password": "123"}'

eyJhbGciOiJIUzI1NiIsXVCJ9.eyJleHAiOjE3A0CBUo_QkeF3zegn2OgY
```


#### Get all products

```
  curl -s -X GET http://localhost:8080/products 
          -H 'Content-Type: application/json' 
          -H 'Authorization: Bearer eJ9.eyJleHAi1lIOt6_A0CBUo_QkeF3zegn2OgY' | jq 

//Expected output
{ "products": [
    {
      "id": "91136132-5f99-4c01-bda0-ae41dd484c6a",
      "name": "the product name",
      "description": "the product descr 5",
      "price": 123.4,
      "qty": 98
    },
    {
      "id": "1b7e5ae0-1f4a-48a6-b1d2-c6f6f1958b30",
      "name": "name changed",
      "description": "description changed",
      "price": 10,
      "qty": 18
    }
  ]
}
```

#### Create a new product
```
curl -X POST http://localhost:8080/products \
-H 'Content-Type: application/json'  \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IyGEZPQGS61eNvZvYXtsOt6_A0CBUo_QkeF3zegn2OgY' \
-d '{"name": "A new cool product", "description": "Really cool product", "price": 123.45, "qty": 100}' | jq

//Expected output
{
  "id": "247c25bd-86a7-4e30-b0cb-6bf1c078fc06",
  "name": "A new cool product",
  "description": "Really cool product",
  "price": 123.45,
  "qty": 100
}

```

#### Get a single product
```
curl -X GET http://localhost:8080/products/247c25bd-86a7-4e30-b0cb-6bf1c078fc06 \
-H 'Authorization: Bearer eyJhbGciOiJIUVzZXJuYW1lIjoiaGVeNvZvYXtsOt6_A0CBUo_QkeF3zegn2OgY' | jq

//Expected output
{
  "id": "247c25bd-86a7-4e30-b0cb-6bf1c078fc06",
  "name": "A new cool product",
  "description": "Really cool product",
  "price": 123.45,
  "qty": 100
}

```

#### Update a product
```
curl -s -X PUT http://localhost:8080/products/247c25bd-86a7-4e30-b0cb-6bf1c078fc06 \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVzNjcsInVzZXJuYW1leNvZvYXtsOt6_A0CBUo_QkeF3zegn2OgY' \
-d '{"name": "name changed", "description": "description changed", "price": 543.21, "qty": 100}' | jq

//Expected output
{
  "id": "247c25bd-86a7-4e30-b0cb-6bf1c078fc06",
  "name": "name changed",
  "description": "description changed",
  "price": 543.21,
  "qty": 100
}

```

#### Delete a product
```
curl -s -X DELETE http://localhost:8080/products/247c25bd-86a7-4e30-b0cb-6bf1c078fc06 \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCIjE3MTMwNDUzNjcsInVzZXJuYW1lI_QkeF3zegn2OgY' | jq

//Expected output
{
  "id": "247c25bd-86a7-4e30-b0cb-6bf1c078fc06",
  "name": "name changed",
  "description": "description changed",
  "price": 543.21,
  "qty": 100
}

```

#### Get all orders
```
curl -s -X GET http://localhost:8080/orders \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6InVzZXJuYW1lIjvZvYXtsOt6_A0CBUo_QkeF3zegn2OgY' | jq

//Expected output
{
  "orders": [
    {
      "id": "9fc92d79-f1c3-4004-a591-02d5bb144a7b",
      "products": [
        {
          "id": "1b7e5ae0-1f4a-48a6-b1d2-c6f6f1958b30",
          "name": "name changed",
          "description": "description changed",
          "price": 10,
          "qty": 20
        },
        {
          "id": "91136132-5f99-4c01-bda0-ae41dd484c6a",
          "name": "the product name",
          "description": "the product descr 5",
          "price": 123.4,
          "qty": 100
        }
      ]
    },
    {
      "id": "25d4c62a-53c3-4a7c-98f4-00d2ed546bd3",
      "products": [
        {
          "id": "1b7e5ae0-1f4a-48a6-b1d2-c6f6f1958b30",
          "name": "name changed",
          "description": "description changed",
          "price": 10,
          "qty": 20
        }
      ]
    } 
    .....
]
}

```

#### Place an order
```
curl -s -X POST http://localhost:8080/orders \
-H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXzZXJuYW1lIjoiaGVsbt6_A0CBUo_QkeF3zegn2OgY' \
-d '{"products": [ \
      {"product": "1b7e5ae0-1f4a-48a6-b1d2-c6f6f1958b30", "qty": 3}, \
      {"product": "91136132-5f99-4c01-bda0-ae41dd484c6a", "qty": 1} \
    ]}'

//Expected output
{
  "id": "f36fd97e-58b7-4552-88ea-51166ad9acaa",
  "products": [
    {
      "id": "1b7e5ae0-1f4a-48a6-b1d2-c6f6f1958b30",
      "name": "name changed",
      "description": "description changed",
      "price": 10,
      "qty": 15
    },
    {
      "id": "91136132-5f99-4c01-bda0-ae41dd484c6a",
      "name": "the product name",
      "description": "the product descr 5",
      "price": 123.4,
      "qty": 97
    }
  ]
}
```

***NOTE:*** The orders service is doing a check for product quantities and also is updating these values after the order is created.


### TODO
Working in this test was very interesting and a real challenge, I reinforced much of my knowledge and also learned a lot. I made a great effort to comply with all the requirements, but some things were left pending, I mention only a few:

- Connect NestJS services to an external database. Right now they are using an SQLite db.
- Set JWT secret and port numbers as environment variables
- Add tests
- Add documentation
