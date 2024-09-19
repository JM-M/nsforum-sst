// import { bucket } from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api");

api.route("POST /posts/notify-subscribers", {
	handler: "packages/functions/src/notify-subscribers.handler",
});
