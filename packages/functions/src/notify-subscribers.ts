import { Notification } from "@nsforum-sst/core/notification";
import { Util } from "@nsforum-sst/core/util";
import { Handler } from "aws-lambda";

export const handler: Handler = Util.handler(async (event) => {
  let data;

  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  try {
    const streamId = event?.pathParameters?.stream_id;
    if (!streamId) {
      const error = new Error("No stream id");
      console.error(error);
      throw error;
    }

    const emailContent = data.emailContent;
    if (!emailContent) {
      const error = new Error("No email ontent");
      console.error(error);
      throw error;
    }

    Notification.sendPostNotifications({ streamId, htmlContent: emailContent });

    return JSON.stringify({
      statusCode: 200,
      body: "queued",
    });
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return JSON.stringify({
      statusCode: 500,
      body: JSON.stringify({ error: message }),
    });
  }
});
