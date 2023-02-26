import { buildConfig } from "payload/config";
import path from "path";

import { resources } from "src/i18n";

import Users from "./collections/Users";
import Committees from "./collections/Committees";

import { LogoIcon, LogoFull } from "./components/logo";

export default buildConfig({
	serverURL: process.env.SERVER_URL || "http://localhost:3000",
	admin: {
		user: Users.slug,
		meta: {
			titleSuffix: "OHM StuVe Graph",
			favicon: "/assets/ohm-logo.svg",
		},
		components: {
			graphics: {
				Icon: LogoIcon,
				Logo: LogoFull,
			},
		},
		// enable absolute imports in webpack
		webpack: (config) => {
			config.resolve.alias["src"] = path.resolve(__dirname);
			return config;
		},
	},
	i18n: {
		fallbackLng: "en",
		supportedLngs: ["en", "de"],
		resources: resources,
	},
	collections: [Users, Committees],
	typescript: {
		outputFile: path.resolve(__dirname, "payload-types.ts"),
	},
	graphQL: {
		schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
	},
	telemetry: false,
});
