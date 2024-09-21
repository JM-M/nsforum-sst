import { Handler } from "aws-lambda";
import { Util } from "@nsforum-sst/core/util";
import { Notification } from "@nsforum-sst/core/notification";

export const handler: Handler = Util.handler(async (event) => {
	let data;

	if (event.body != null) {
		data = JSON.parse(event.body);
	}

	try {
		const streamId = event?.pathParameters?.stream_id;
		if (!streamId) throw new Error("No stream id");

		const emailContent = data.emailContent;
		if (!emailContent) throw new Error("No email ontent");

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
