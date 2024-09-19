import { Resource } from "sst";
import { Handler } from "aws-lambda";
import { Example } from "@nsforum-sst/core/example";

export const handler: Handler = async (_event) => {
	return {
		statusCode: 200,
		body: `Hitting the example: ${Example.hello()}.`,
	};
};
