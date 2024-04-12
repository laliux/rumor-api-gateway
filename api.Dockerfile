FROM golang:1.22-alpine

WORKDIR /app

COPY api-gateway/go.mod api-gateway/go.sum ./

RUN go mod download

COPY ./api-gateway .

RUN go build -o main .

EXPOSE 8080

CMD ["./main"]
