import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Keyword } from "./keyword";
import { News } from "./news";

@Table({ tableName: "NewsKeyword" })
export class NewsKeyword extends Model {
  @ForeignKey(() => News)
  @Column(DataType.INTEGER)
  news_id!: number;

  @ForeignKey(() => Keyword)
  @Column(DataType.INTEGER)
  keyword_id!: number;
}
