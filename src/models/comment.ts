import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "Comment" })
export class Comment extends Model {
  @Column(DataType.INTEGER)
  order?: number;

  @Column(DataType.INTEGER)
  news_id?: number;

  @Column(DataType.STRING)
  comment_type?: string;

  @Column(DataType.STRING)
  title?: string;

  @Column(DataType.TEXT)
  comment?: string;

  @Column(DataType.DATE)
  date?: Date;
}
