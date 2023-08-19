import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './Post';


enum UserRole {
  Blogger = 'blogger',
  Admin = 'admin',
}

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  type!: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash!: string;

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

  @HasMany(() => Post)
  posts!: Post[];
  
}