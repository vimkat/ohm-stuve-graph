import type { Field } from "payload/types";

const options = [
	{
		value: "chair",
		label: { en: "Chairperson", de: "Vorsitzende*r" },
	},
	{
		value: "depchair-1",
		label: {
			en: "1st Deputy Chairperson",
			de: "1. Stellvertretende*r Vorsitzende*r",
		},
	},
	{
		value: "depchair-2",
		label: {
			en: "2nd Deputy Chairperson",
			de: "2. Stellvertretende*r Vorsitzende*r",
		},
	},
	{
		value: "elected",
		label: { en: "Elected Representative", de: "Gewählte*r" },
	},
	{
		value: "delegated",
		label: { en: "Delegation Member", de: "Delegierte*r" },
	},
	{
		value: "co-opted",
		label: { en: "Co-Opted Member", de: "Kooptiertes Mitglied" },
	},
	{
		value: "member",
		label: { en: "Member", de: "Mitglied" },
	},
	{
		value: "deputy",
		label: {
			en: "Deputy",
			de: "Stellvertretende",
		},
	},
];

export const lookupMemberPosition = (id: string) =>
	options.find((option) => option.value === id).label;

export const memberPosition: Field = {
	name: "position",
	type: "select",
	options,
	defaultValue: "member",
	required: true,
};
