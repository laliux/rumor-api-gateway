import {
  Column,
  Table,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
//import { Order } from './order.interface';
//import { Product } from './product.interface';

@Table({
  tableName: 'orders'
})
export class OrderEntity extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string;

  @Column({
    type: DataType.JSONB
  })
  products: any;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
