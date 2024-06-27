import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "User" })
export class User extends Model<User> {
  @Column({ primaryKey: true, type: DataType.STRING })
  id!: string;

  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  platform!: string;
}
