import { Post } from './post.model';
import { CreatePostDto } from './dto/create-post.dto';
import { Attributes, Op, WhereOptions } from 'sequelize';
import { UserRole } from '../user/user.model';
class PostService {
  public async create(
    createPostDto: CreatePostDto,
    userId: number
  ): Promise<Post> {
    const newPost = await Post.create({
      ...createPostDto,
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newPost;
  }

  public async findPaginated(
    userId: number,
    page: number,
    pageSize: number
  ): Promise<{ items: Post[]; totalItems: number }> {
    const offset = (page - 1) * pageSize;

    const { count, rows: items } = await Post.findAndCountAll({
      where: {
        [Op.or]: [{ isHidden: false }, { authorId: userId }],
      },
      offset,
      limit: pageSize,
    });

    return { items, totalItems: count };
  }

  public async getById(id: number): Promise<Post | null> {
    const post = await Post.findByPk(id);
    return post;
  }

  public async update(
    id: number,
    updateData: Partial<CreatePostDto>
  ): Promise<[number, Post[]]> {
    const [updatedRowsCount, updatedPosts] = await Post.update(updateData, {
      where: { id },
      returning: true,
    });
    return [updatedRowsCount, updatedPosts];
  }

  public async delete(
    postId: number,
    userId: number,
    userRole: UserRole
  ): Promise<number> {
    try {
      const where: WhereOptions<Attributes<Post>> = { id: postId };
      console.log(postId, userId, userRole);

      if (userRole === UserRole.Admin) {
        where.isHidden = false;
      } else {
        where.authorId = userId;
      }
      return Post.destroy({ where });
    } catch (error) {
      console.error('Error deleting post:', error);
      return 0;
    }
  }
}

export default new PostService();
