package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	pbOrder "github.com/laliux/rumor-api-gateway/protogen/golang/order"
)

func (c *grpcClients) handleOrdersRequests(w http.ResponseWriter, r *http.Request) {

	switch r.Method {
	case http.MethodGet:
		c.getAllOrders(w, r)
	case http.MethodPost:
		c.createOrder(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (c *grpcClients) createOrder(w http.ResponseWriter, r *http.Request) {

	var orderData OrderData
	if err := json.NewDecoder(r.Body).Decode(&orderData); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	createOrderRequest := &pbOrder.CreateOrderRequest{
		OrderProducts: []*pbOrder.OrderProduct{},
	}

	for _, p := range orderData.OrderProducts {
		createOrderRequest.OrderProducts = append(createOrderRequest.OrderProducts, &pbOrder.OrderProduct{
			Product: p.Product,
			Qty:     p.Qty,
		})
	}

	response, err := c.orderClient.CreateOrder(context.Background(), createOrderRequest)
	if err != nil {
		http.Error(w, "Failed to place an order ", http.StatusInternalServerError)
		return
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}

func (c *grpcClients) getAllOrders(w http.ResponseWriter, r *http.Request) {
	getAllOrdersRequest := &pbOrder.GetAllOrdersRequest{}

	response, err := c.orderClient.GetAllOrders(context.Background(), getAllOrdersRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Failed to get orders", http.StatusInternalServerError)
		return
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Failed to marshal response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
