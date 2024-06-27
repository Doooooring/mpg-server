import { Column, DataType, Model, Table } from "sequelize-typescript";

interface TimelineItem {
  date: string;
  title: string;
}

@Table({ tableName: "News" })
export class News extends Model<News> {
  @Column({ primaryKey: true, type: DataType.STRING })
  id!: string;

  @Column(DataType.INTEGER)
  order!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  summary!: string;

  @Column(DataType.BOOLEAN)
  state!: boolean;

  @Column(DataType.BOOLEAN)
  isPublished!: boolean;

  @Column(DataType.STRING)
  opinions_left!: string;

  @Column(DataType.STRING)
  opinions_right!: string;

  @Column(DataType.JSONB)
  timeline!: TimelineItem[];
}
