import { CollectionConfig } from "payload/types";
import MemberHeader from "src/components/member-header";
import { memberPosition } from "src/fields/member-position";
import Users from "./Users";

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
	fields: [
		// Email added by default
		// Add more fields as needed
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
					relationTo: Users.slug,
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
	],
};

export default Committees;
