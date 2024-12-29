import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { News } from "./news";

@Table({ tableName: "Keyword" })
export class Keyword extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: number;

  @Index
  @Default("")
  @Column(DataType.STRING)
  keyword?: string;

  @Default("")
  @Column(DataType.STRING)
  explain?: string;

  @Column(DataType.STRING)
  category?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  recent?: boolean;

  @Column(DataType.STRING)
  keywordImage?: string;

  // N:M 관계
  @BelongsToMany(() => News, "NewsKeyword", "keywordId", "newsId")
  news?: News[];
}
