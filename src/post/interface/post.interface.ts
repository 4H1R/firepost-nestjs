import { Post, PostLike, PostSave, User } from '@prisma/client';

export interface IPost extends Post {
  user: User;
  saves: PostSave[];
  likes: PostLike[];
  _count: {
    likes: number;
    comments: number;
  };
}
