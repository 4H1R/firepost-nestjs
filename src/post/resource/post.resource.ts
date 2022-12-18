import { JsonResource } from 'src/common/resource';
import { UserResource } from 'src/user/resource';
import { IPost } from '../interface';
import { PostImageResource } from './post-image.resource';

export class PostResource extends JsonResource {
  public static toJson(data: IPost) {
    const post = PostImageResource.toJson(data);
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
