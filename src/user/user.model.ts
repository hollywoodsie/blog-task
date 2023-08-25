import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Post } from '../post/post.model';
import { Exclude } from 'class-transformer';

export enum UserRole {
  Blogger = 'blogger',
  Admin = 'admin',
}

@Table({ tableName: 'user' })
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Exclude()
  passwordHash: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  @HasMany(() => Post)
  posts: Post[];
}
