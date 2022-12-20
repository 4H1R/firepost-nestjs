import { JsonResource } from 'src/common/resource';
import { UserResource } from 'src/user/resource';
import { IPost } from '../interface';
import { PostResource } from './post.resource';

export class PostFullResource extends JsonResource {
  public static toJson(data: IPost) {
    const post = PostResource.toJson(data);
    const user = UserResource.toJson(data.user);
    return {
      ...post,
      user,
      likesCount: data._count.likes,
      commentsCount: data._count.comments,
      isLiked: data.likes.length !== 0,
      isSaved: data.saves.length !== 0,
    };
  }
}
