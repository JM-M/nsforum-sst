export type ReactionType = "upvote" | "downvote" | "none";

export type ReactionModel = "posts" | "comments";

export type Reaction = {
  content_id: string;
  type: ReactionType;
  user_id: string;
  model: ReactionModel;
};

export type ReactionCounter = {
  upvotes: number;
  downvotes: number;
  content_id: string;
  model: string;
};
