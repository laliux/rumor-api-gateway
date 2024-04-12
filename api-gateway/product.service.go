package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	pbProduct "github.com/laliux/rumor-api-gateway/protogen/golang/product"
)

func (c *grpcClients) handleProductRequests(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		c.getProduct(w, r)
	case http.MethodPut:
		c.updateProduct(w, r)
	case http.MethodDelete:
		c.deleteProduct(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (c *grpcClients) handleProductsRequests(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		c.getAllProducts(w, r)
	case http.MethodPost:
		c.createProduct(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (c *grpcClients) getAllProducts(w http.ResponseWriter, r *http.Request) {
	getAllProductsRequest := &pbProduct.GetAllProductsRequest{}

	response, err := c.productClient.GetAllProducts(context.Background(), getAllProductsRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Failed to get products", http.StatusInternalServerError)
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

func (c *grpcClients) getProduct(w http.ResponseWriter, r *http.Request) {
	productId := r.PathValue("id")

	fmt.Println("The id: ", r.PathValue("id"))

	getProductByIdRequest := &pbProduct.ProductByIdRequest{
		Id: productId,
	}

	response, err := c.productClient.GetProductById(context.Background(), getProductByIdRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Failed to get product", http.StatusInternalServerError)
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

func (c *grpcClients) createProduct(w http.ResponseWriter, r *http.Request) {

	var productData ProductData
	if err := json.NewDecoder(r.Body).Decode(&productData); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	createProductRequest := &pbProduct.CreateProductRequest{
		Name:        productData.Name,
		Description: productData.Description,
		Price:       productData.Price,
		Qty:         productData.Qty,
	}

	response, err := c.productClient.CreateProduct(context.Background(), createProductRequest)
	if err != nil {
		http.Error(w, "Failed to create product", http.StatusInternalServerError)
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

func (c *grpcClients) updateProduct(w http.ResponseWriter, r *http.Request) {
	productId := r.PathValue("id")

	var productData ProductData
	if err := json.NewDecoder(r.Body).Decode(&productData); err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}

	updateProductRequest := &pbProduct.UpdateProductRequest{
		Id: productId,
		Product: &pbProduct.Product{
			Name:        productData.Name,
			Description: productData.Description,
			Price:       productData.Price,
			Qty:         productData.Qty,
		},
	}

	response, err := c.productClient.UpdateProduct(context.Background(), updateProductRequest)
	if err != nil {
		http.Error(w, "Failed to update product", http.StatusInternalServerError)
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

func (c *grpcClients) deleteProduct(w http.ResponseWriter, r *http.Request) {

	productID := r.PathValue("id")
	productByIdRequest := &pbProduct.ProductByIdRequest{
		Id: productID,
	}

	response, err := c.productClient.DeleteProductById(context.Background(), productByIdRequest)
	if err != nil {
		http.Error(w, "Failed to delete the product", http.StatusInternalServerError)
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
