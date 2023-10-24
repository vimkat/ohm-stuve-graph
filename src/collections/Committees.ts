import { CollectionConfig } from "payload/types";
import MemberHeader from "../components/member-header";
import { memberPosition } from "../fields/member-position";
import { term } from "../fields/term";

const Committees: CollectionConfig = {
	slug: "committees",
	labels: {
		singular: { en: "Committee", de: "Gremium" },
		plural: { en: "Committees", de: "Gremien" },
	},
	admin: {
		useAsTitle: "name",
		listSearchableFields: ["name", "abbreviation"],
	},
	access: {
		read: () => true,
	},
	versions: {
		drafts: true,
	},
	fields: [
		{
			type: "row",
			fields: [
				{
					name: "name",
					label: "Name",
					type: "text",
					required: true,
					admin: {
						width: "80%",
					},
				},
				{
					name: "abbreviation",
					label: { en: "Abbreviation", de: "Abkürzung" },
					type: "text",
					required: true,
					unique: true,
					admin: {
						width: "20%",
					},
				},
			],
		},
		{
			name: "reports_to",
			label: { en: "Reports To", de: "Übergeordnetes Gremium" },
			type: "relationship",
			relationTo: "committees",
			filterOptions: ({ relationTo, id }) => {
				// Disallow relations to itself
				if (relationTo == "committees") return { id: { not_equals: id } };
			},
		},
		{
			name: "type",
			label: { en: "Committee Type", de: "Gremien-Typ" },
			type: "select",
			options: [
				{ value: "AS", label: "Ausschuss" }, // mostly from StuPa
				{ value: "AK", label: "Arbeitskreis" }, // mostly from AStA
				{ value: "FakRat", label: "Fakultätsrat" },
				{ value: "FakAG", label: "Fakultäts-AG" },
				{ value: "FS", label: "Fachschaft" },
				{ value: "AG", label: "Arbeitsgruppe" }, // mostly from FS
			],
			admin: {
				position: "sidebar",
			},
		},
		term(),
		{
			name: "members",
			label: { en: "Members", de: "Mitglieder" },
			labels: {
				singular: { en: "Member", de: "Mitglied" },
				plural: { en: "Members", de: "Mitglieder" },
			},
			type: "array",
			fields: [
				{
					name: "user",
					type: "relationship",
					relationTo: "users",
					required: true,
				},
				memberPosition,
			],
			admin: {
				initCollapsed: true,
				components: {
					RowLabel: MemberHeader,
				},
			},
		},

		// Virtual field for TeX macros
		{
			name: "tex_macros",
			label: "TeX Macros",
			type: "code",
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						siblingData.tex_macros = undefined;
					},
				],
				afterRead: [
					({ data, findMany, req }) =>
						!findMany
							? req.payload
									.find({
										collection: "users",
										pagination: false,
										where: {
											id: {
												in: data.members.map((member) => member.user).join(","),
											},
										},
									})
									.then((result) =>
										result.docs
											.map((user) => `\\def\\${user.human_id}{${user.name}}`)
											.join("\n"),
									)
							: "only available when fetching a single document",
				],
			},
			access: {
				create: () => false,
				update: () => false,
			},
			admin: {
				readOnly: true,
				description: {
					en: "Copy this if you want to use human IDs in TeX",
					de: "Zur Verwendung von Kürzeln in TeX können diese hier kopiert werden",
				},
			},
		},
	],
};

export default Committees;
