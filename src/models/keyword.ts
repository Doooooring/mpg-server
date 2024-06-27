import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Keyword" })
export class Keyword extends Model<Keyword> {
  @Column({ primaryKey: true, type: DataType.STRING })
  id!: string;

  @Column(DataType.STRING)
  keyword!: string;

  @Column(DataType.STRING)
  explain!: string;

  @Column(DataType.STRING)
  category!: string;

  @Column(DataType.BOOLEAN)
  recent!: boolean;
}
