import {
  AutoIncrement,
  BelongsToMany,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Keyword } from "./keyword";
import { Timeline } from "./timeline";
import { Vote } from "./vote";
import { Comment } from "./comment";

export interface TimelineItem {
  date: string;
  title: string;
}

@Table({ tableName: "News" })
export class News extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: number;

  @Column(DataType.INTEGER)
  order?: number;

  @Default("")
  @Column(DataType.STRING)
  title?: string;

  @Default("")
  @Column(DataType.STRING)
  subTitle?: string;

  @Default("")
  @Column(DataType.STRING)
  summary?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  state?: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPublished?: boolean;

  @Default("")
  @Column(DataType.STRING)
  opinionLeft?: string;

  @Default("")
  @Column(DataType.STRING)
  opinionRight?: string;

  @Column(DataType.STRING)
  newsImage?: string;

  // 1:N 관계
  @HasMany(() => Comment)
  comments?: Comment[];

  @HasMany(() => Timeline)
  timeline?: Timeline[];

  @HasMany(() => Vote)
  votes?: Vote[];

  @BelongsToMany(() => Keyword, "NewsKeyword", "newsId", "keywordId")
  keywords?: Keyword[];
}
