import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { News } from "./news";
import { User } from "./user";

@Table({ tableName: "Vote" })
export class Vote extends Model {
  @ForeignKey(() => News)
  @Column({ primaryKey: true, type: DataType.STRING })
  newsId!: string;

  @ForeignKey(() => User)
  @Column({ primaryKey: true, type: DataType.STRING })
  userId!: string;

  @Column(DataType.STRING)
  response!: string;
}
