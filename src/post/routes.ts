import { Router } from 'express';
import postController from '../post/post.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreatePostDto } from './dto/create-post.dto';
import { ReqParamsDto } from './dto/request-params.dto';
import { GetPaginatedPostsDto } from './dto/get-paginated-post.dto';

const router = Router();

router.post(
  '/',
  validationMiddleware({ bodyDto: CreatePostDto }),
  postController.create.bind(postController)
);
router.get(
  '/',
  validationMiddleware({ queryDto: GetPaginatedPostsDto }),
  postController.getPaginated.bind(postController)
);
router.get(
  '/:id',
  // validationMiddleware({ paramsDto: ReqParamsDto }),
  postController.getOneById.bind(postController)
);
router.put(
  '/:id',
  // validationMiddleware({
  //   paramsDto: ReqParamsDto,
  //   bodyDto: UpdatePostDto,
  // }),
  postController.update.bind(postController)
);
router.delete(
  '/:id',
  // validationMiddleware({ paramsDto: ReqParamsDto }),
  postController.delete.bind(postController)
);

export default router;
