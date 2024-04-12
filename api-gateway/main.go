package main

import (
	"log"
	"net/http"

	"google.golang.org/grpc"
)

func main() {
	// Connect to gRPC services
	productConn, err := grpc.Dial("products:5000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to Product gRPC service: %v", err)
	}
	defer productConn.Close()

	orderConn, err := grpc.Dial("orders:6000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to Order gRPC service: %v", err)
	}
	defer orderConn.Close()

	// Initialize gRPC clients
	grpcClients := NewGRPCClients(productConn, orderConn)

	mux := http.NewServeMux()

	// Set up HTTP routes
	mux.HandleFunc("/products", authenticate(grpcClients.handleProductsRequests))
	mux.HandleFunc("/products/{id}", authenticate(grpcClients.handleProductRequests))
	mux.HandleFunc("/orders", authenticate(grpcClients.handleOrdersRequests))
	mux.HandleFunc("/login", loginHandler)

	// Start HTTP server
	log.Println("API Gateway listening on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Failed to start API Gateway: %v", err)
	}
}
