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
} from "sequelize-typescript";
import { News } from "./news";

@Table({ tableName: "Timeline" })
export class Timeline extends Model<Timeline> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: number;

  // typeorm 의 timestamp default CURRENT_TIMESTAMP 와 유사
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  date?: Date;

  @Default("")
  @Column(DataType.STRING)
  title?: string;

  // ManyToOne
  @ForeignKey(() => News)
  @Column(DataType.INTEGER)
  newsId?: number;

  @BelongsTo(() => News)
  news?: News;
}
