import { Request, Response } from 'express';
import PostService from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

import { GetPaginatedPostsDto } from './dto/get-paginated-post.dto';
import { ReqParamsDto } from './dto/request-params.dto';
class PostController {
  public async create(
    req: Request<unknown, unknown, CreatePostDto>,
    res: Response
  ): Promise<void> {
    try {
      const createPostDto: CreatePostDto = req.body;
      const authorId = req.user!.id;
      const createdPost = await PostService.create(createPostDto, authorId);

      res.status(201).json(createdPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getPaginated(
    req: Request<unknown, unknown, GetPaginatedPostsDto>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = Number(req.query.page);
      const pageSize = Number(req.query.pageSize);

      if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
        res.status(400).json({ error: 'Invalid query parameters' });
        return;
      }

      const { items, totalItems } = await PostService.findPaginated(
        userId,
        page,
        pageSize
      );

      const totalPages = Math.ceil(totalItems / pageSize);
      if (page > totalPages) {
        res.status(400).json({ error: 'Requested page exceeds total pages' });
        return;
      }

      res.status(200).json({
        items,
        currentPage: page,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems,
      });
    } catch (error) {
      console.error('Error getting paginated posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getOneById(
    req: Request<ReqParamsDto>,
    res: Response
  ): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const post = await PostService.getById(postId);

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async update(
    req: Request<ReqParamsDto, unknown, CreatePostDto>,
    res: Response
  ): Promise<void> {
    try {
      const { id: postId } = req.params;
      const updateData: Partial<CreatePostDto> = req.body;
      const [updatedRowsCount, updatedPosts] = await PostService.update(
        postId,
        updateData
      );

      if (updatedRowsCount > 0) {
        res.status(200).json(updatedPosts);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async delete(
    req: Request<ReqParamsDto>,
    res: Response
  ): Promise<void> {
    const postId = Number(req.params.id);

    const { id: userId, role: userRole } = req.user!;

    try {
      const affectedRows = await PostService.delete(postId, userId, userRole);

      if (affectedRows > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({
          error: 'Post not found or you do not have permission to delete.',
        });
      }
    } catch (error) {
      console.error('Error in postController.deletePost:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while deleting the post.' });
    }
  }
}
const postController = new PostController();
export default postController;
