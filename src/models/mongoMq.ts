import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "MongoMq" })
export class MongoMq extends Model {
  @Column(DataType.INTEGER)
  mqId!: number;

  @Column(DataType.STRING)
  mongoId!: string;
}
