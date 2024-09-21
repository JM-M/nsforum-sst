import { OrbisConfig } from "@useorbis/db-sdk";
import { Resource } from "sst";

const config: OrbisConfig = {
	ceramic: {
		gateway: Resource.CERAMIC_NODE_URL.value,
	},
	nodes: [
		{
			gateway: Resource.ORBIS_NODE_URL.value,
			env: Resource.ORBIS_ENVIRONMENT_ID.value,
		},
	],
};

export default config;
