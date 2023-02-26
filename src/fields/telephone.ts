import type { Field } from "payload/types";
import { text } from "payload/dist/fields/validations";

const telephoneRegex =
	/\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

export const telephone: Field = {
	name: "telephone",
	label: { en: "Telephone", de: "Telefon" },
	type: "text",
	validate: (val, args) =>
		val !== ""
			? telephoneRegex.test(val) || args.t("errors:telephone")
			: text(val, args),
};
