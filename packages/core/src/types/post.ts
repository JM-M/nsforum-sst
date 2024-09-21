import { PostStatus } from "../schema/post";

export type Post = {
  slug: string;
  author_username: string;
  preview: string;
  title: string;
  body: string;
  category: string;
  tag_ids: string[];
  status: PostStatus;
  stream_id?: string;
};
