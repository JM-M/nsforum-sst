export type Category = {
  name: string;
  description: string;
};

export type CategorySuggestionStatus = "accepted" | "rejected" | "pending";
export type CategorySuggestion = {
  name: string;
  description: string;
  status: CategorySuggestionStatus;
};
