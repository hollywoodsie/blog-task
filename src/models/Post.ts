import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';

@Table
export class Post extends Model<Post> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  authorId!: number;

  @BelongsTo(() => User)
  author!: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt!: Date;
}