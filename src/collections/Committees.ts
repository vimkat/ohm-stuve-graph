import { CollectionConfig } from "payload/types";

const Committees: CollectionConfig = {
	slug: "committees",
	labels: {
		singular: "Gremium",
		plural: "Gremien",
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
					label: "Abkürzung",
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
			label: "Übergeordnetes Gremium",
			type: "relationship",
			relationTo: "committees",
			filterOptions: ({ relationTo, id }) => {
				// Disallow relations to itself
				if (relationTo == "committees") return { id: { not_equals: id } };
			},
		},
		{
			name: "type",
			label: "Gremien-Typ",
			type: "select",
			options: [
				{ value: "AS", label: "Ausschuss" }, // mostly from StuPa
				{ value: "AK", label: "Arbeitskreis" }, // mostly from AStA
				{ value: "FR", label: "Fakultätsrat" },
				{ value: "FAG", label: "Fakultäts-AG" },
				{ value: "FS", label: "Fachschaft" },
				{ value: "AG", label: "Arbeitsgruppe" }, // mostly from FS
			],
		},
		{
			name: "members",
			label: "Mitglieder",
			type: "relationship",
			relationTo: "users",
			hasMany: true,
		},
	],
};

export default Committees;
