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
export class NewsKeyword extends Model<NewsKeyword> {
  @Column({ primaryKey: true, type: DataType.STRING })
  id!: string;

  @ForeignKey(() => News)
  @Column(DataType.STRING)
  news_id!: string;

  @ForeignKey(() => Keyword)
  @Column(DataType.STRING)
  keyword_id!: string;
}
