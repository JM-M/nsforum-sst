import { OrbisDBRow } from ".";

export type Subscription = {
  author_did: string;
  reader_did: string;
  subscribed: boolean;
  post_notifications: boolean;
};

export type SubscriptionData = {
  subscription: OrbisDBRow<Subscription> | null;
  subscribedToCount: number;
  subscriberCount: number;
};
