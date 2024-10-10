import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Keyword" })
export class Keyword extends Model {
  @Column(DataType.STRING)
  keyword!: string;

  @Column(DataType.TEXT)
  explain!: string;

  @Column(DataType.STRING)
  category!: string;

  @Column(DataType.BOOLEAN)
  recent!: boolean;
}
