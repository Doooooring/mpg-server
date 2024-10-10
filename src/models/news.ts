import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface TimelineItem {
  date: string;
  title: string;
}

@Table({ tableName: "News" })
export class News extends Model {
  @Column(DataType.INTEGER)
  order?: number;

  @Column(DataType.STRING)
  title?: string;

  @Column(DataType.TEXT)
  summary?: string;

  @Column(DataType.BOOLEAN)
  state?: boolean;

  @Column(DataType.BOOLEAN)
  isPublished?: boolean;

  @Column(DataType.STRING)
  opinion_left?: string;

  @Column(DataType.STRING)
  opinion_right?: string;
}
