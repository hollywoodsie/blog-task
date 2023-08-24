import { Request, Response } from 'express';
import { postService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

import { GetPaginatedPostsDto } from './dto/get-paginated-post.dto';
import { ReqParamsDto } from './dto/request-params.dto';
import { CatchError } from '../utils/catchError';
import { NotFoundException } from '../errors/not-found.exception';
import { BadRequestException } from '../errors/bad-request.exception';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';

class PostController {
  @CatchError
  public async create(
    req: Request<unknown, unknown, CreatePostDto>,
    res: Response
  ): Promise<void> {
    const createPostDto: CreatePostDto = req.body;
    const authorId = req.user!.id;
    const createdPost = await postService.create(createPostDto, authorId);

    res.status(201).json(createdPost);
  }

  @CatchError
  public async getPaginated(
    req: Request<unknown, unknown, GetPaginatedPostsDto>,
    res: Response
  ): Promise<void> {
    const userId = req.user!.id;
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;
    console.log(page, pageSize);

    if (isNaN(page) || isNaN(pageSize) || page <= 0 || pageSize <= 0) {
      throw new BadRequestException('Invalid query parameters');
    }

    const { items, totalItems } = await postService.findPaginated(
      userId,
      page,
      pageSize
    );

    const totalPages = Math.ceil(totalItems / pageSize);
    if (page > totalPages) {
      throw new BadRequestException('Requested page exceeds total pages');
    }

    res.status(200).json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    });
  }
  @CatchError
  public async getOneById(
    req: Request<ReqParamsDto>,
    res: Response
  ): Promise<void> {
    const postId = Number(req.params.id);
    const post = await postService.getById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    res.status(200).json(post);
  }

  @CatchError
  public async update(
    req: Request<ReqParamsDto, unknown, CreatePostDto>,
    res: Response
  ): Promise<void> {
    const { id: postId } = req.params;
    const updateData: Partial<CreatePostDto> = req.body;
    const [updatedRowsCount, updatedPosts] = await postService.update(
      postId,
      updateData
    );

    if (!updatedRowsCount) {
      throw new NotFoundException('Post not found');
    }
    res.status(200).json(updatedPosts);
  }

  @CatchError
  public async delete(
    req: Request<ReqParamsDto>,
    res: Response
  ): Promise<void> {
    const postId = Number(req.params.id);
    const { id: userId, role: userRole } = req.user!;
    const affectedRows = await postService.delete(postId, userId, userRole);

    if (!affectedRows) {
      throw new NotFoundException(
        'Post not found or you do not have permission to delete'
      );
    }

    res.status(204).send();
  }
}

export const postController = new PostController();
