import type { Field, SelectField } from "payload/types";
import deepMerge from "../utils/deepMerge";

type Term = (overrides?: Partial<SelectField>) => SelectField;

export const lookupTerm = (term: string) =>
	termValues.find((option) => option.value === term).label;

export const termValues = [
	{ value: "16", label: "XVI - Legislatur 2022/2023" },
	{ value: "17", label: "XVII - Legislatur 2023/2024" },
];

export const term: Term = (overrides) =>
	deepMerge(
		{
			name: "term",
			label: { en: "Term", de: "Legislatur" },
			type: "select",
			options: termValues,
		},
		overrides,
	);
