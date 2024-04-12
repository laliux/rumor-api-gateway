package main

import (
	pbOrder "github.com/laliux/rumor-api-gateway/protogen/golang/order"
	pbProduct "github.com/laliux/rumor-api-gateway/protogen/golang/product"
	"google.golang.org/grpc"
)

type ProductData struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float32 `json:"price"`
	Qty         uint32  `json:"qty"`
}

type OrderProduct struct {
	Product string `json:"product"`
	Qty     uint32 `json:"qty"`
}

type OrderData struct {
	OrderProducts []*OrderProduct `json:"products"`
}

type grpcClients struct {
	productClient pbProduct.ProductServiceClient
	orderClient   pbOrder.OrderServiceClient
}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func NewGRPCClients(productConn *grpc.ClientConn, orderConn *grpc.ClientConn) *grpcClients {
	return &grpcClients{
		productClient: pbProduct.NewProductServiceClient(productConn),
		orderClient:   pbOrder.NewOrderServiceClient(orderConn),
	}
}
