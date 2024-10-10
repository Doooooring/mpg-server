import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Timeline" })
export class Timeline extends Model {
  @Column(DataType.DATE)
  date?: Date;

  @Column(DataType.STRING)
  title?: string;

  @Column(DataType.INTEGER)
  news_id?: number;
}
