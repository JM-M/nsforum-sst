import { Email } from "../email";
import { Orbis } from "../orbis";
import models from "../orbis/models";
import { Post } from "../types/post";

export module Notification {
  export async function sendPostNotifications({
    streamId,
    htmlContent,
  }: {
    streamId: string;
    htmlContent: string;
  }) {
    const post = await Orbis.findRow<Post>({
      model: "posts",
      where: { stream_id: streamId },
    });

    if (!post) throw new Error("No post found");

    const subscribersQuery = `
      {
        ${models.subscriptions.name}(filter: {author_did: "${post.controller}", post_notifications: true}) {
          reader {
            stream_id
            email
            username
            controller
          }
        }
      }
    `;
    const subscribers = await Orbis.gql<{
      reader: {
        stream_id: string;
        email: string;
        username: string;
        controller: string;
      };
    }>({
      model: "subscriptions",
      query: subscribersQuery,
    });

    const messageVersions = [
      {
        to: subscribers.map((subscriber) => {
          const {
            reader: { email, username },
          } = subscriber;
          return { email, name: username };
        }),
      },
    ];

    await Email.bulkSend({
      subject: `[NSForum] ${post.title}`,
      htmlContent,
      messageVersions,
    });
  }
}
