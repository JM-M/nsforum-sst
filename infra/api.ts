import {
  BREVO_API_KEY,
  CERAMIC_NODE_URL,
  FRONTEND_URL,
  ORBIS_ENVIRONMENT_ID,
  ORBIS_NODE_URL,
} from "./storage";

export const api = new sst.aws.ApiGatewayV2("Api");

api.route("POST /posts/{stream_id}/notify-subscribers", {
  handler: "packages/functions/src/notify-subscribers.handler",
  link: [
    ORBIS_ENVIRONMENT_ID,
    ORBIS_NODE_URL,
    CERAMIC_NODE_URL,
    FRONTEND_URL,
    BREVO_API_KEY,
  ],
});
