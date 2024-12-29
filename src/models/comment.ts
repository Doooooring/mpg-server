import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from "sequelize-typescript";
import { News } from "./news";

@Table({ tableName: "Comment" })
export class Comment extends Model<Comment> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: number;

  @Column(DataType.INTEGER)
  order?: number;

  @Column(DataType.STRING)
  commentType?: string;

  @Default("")
  @Column(DataType.STRING)
  title?: string;

  @Default("")
  @Column(DataType.TEXT)
  comment?: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  date?: Date;

  // Sequelize 가 제공하는 UpdatedAt 데코레이터
  @UpdatedAt
  updatedAt?: Date;

  // ManyToOne
  @ForeignKey(() => News)
  @Column(DataType.INTEGER)
  newsId?: number;

  @BelongsTo(() => News)
  news?: News;
}
