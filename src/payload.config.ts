import { buildConfig } from "payload/config";
import path from "path";

import { resources } from "./i18n";

import Users from "./collections/Users";
import Committees from "./collections/Committees";

import { LogoIcon, LogoFull } from "./components/logo";

// Set the server URL based on where this file gets evaluated
const serverURL =
	"document" in globalThis
		? document?.location?.origin // browser context
		: process.env.PAYLOAD_URL || // nodejs context
		  `http://localhost:${process.env.PORT || 3000}`; // development (nodejs) context

export default buildConfig({
	serverURL: serverURL,
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
