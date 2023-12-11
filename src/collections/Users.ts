import { CollectionConfig } from "payload/types";
import { text } from "payload/dist/fields/validations";
import { telephone } from "../fields/telephone";
import { DATE_FORMAT } from "../app.config";
import { term } from "../fields/term";
import DischargeHeader from "../components/discharge-header";

const Users: CollectionConfig = {
	slug: "users",
	labels: {
		singular: "User",
		plural: "Users",
	},
	auth: true,
	access: {
		// FIXME: Only superadmins can log in for now
		admin: ({ req: { user } }) => user.role === "superadmin",
	},
	admin: {
		useAsTitle: "name",
	},
	fields: [
		// Email added by default
		// Add more fields as needed
		{
			type: "tabs",
			tabs: [
				{
					label: "Person",
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
									name: "human_id",
									label: { en: "Human ID", de: "Kürzel" },
									type: "text",
									required: true,
									validate: async (val, args) => {
										const next = () => text(val, args);
										// Nothing can be done without access to the DB
										if (!args.payload) return next();

										const activeUserWithSameID = await args.payload.find({
											collection: "users",
											where: {
												id: { not_equals: args.id },
												human_id: { equals: val },
												active_until: { exists: false },
											},
											pagination: false,
											limit: 1,
										});

										// Human ID is invalid
										if (activeUserWithSameID.docs.length > 0)
											return `Kürzel ${val} wird bereits von ${activeUserWithSameID.docs[0].name} genutzt`;

										// Default validation
										return next();
									},
									admin: {
										width: "20%",
									},
									index: true,
								},
							],
						},
						{
							name: "faculty",
							label: { en: "Faculty", de: "Fakultät" },
							type: "select",
							options: [
								{ value: "AC", label: "AC - Angewandte Chemie" },
								{
									value: "AMP",
									label:
										"AMP - Angewandte Mathematik, Physik und Allgemeinwissenschaften",
								},
								{ value: "AR", label: "AR - Architektur" },
								{ value: "BI", label: "BI - Bauingenieurwesen" },
								{ value: "BW", label: "BW - Betriebswirtschaft" },
								{ value: "D", label: "D - Design" },
								{
									value: "EFI",
									label:
										"EFI - Elektrotechnik Feinwerktechnik Informationstechnik",
								},
								{ value: "IN", label: "IN - Informatik" },
								{
									value: "MB/VS",
									label: "MB/VS - Maschinenbau und Versorgungstechnik",
								},
								{ value: "SW", label: "SW - Sozialwissenschaften" },
								{ value: "VT", label: "VT - Verfahrenstechnik" },
								{ value: "WT", label: "WT - Werkstofftechnik" },
								{ value: "SoH", label: "SoH - Nürnberg School of Health" },
							],
							required: true,
						},
						{
							type: "row",
							fields: [
								{
									name: "active_since",
									label: { en: "Active Since", de: "Aktiv Seit" },
									type: "date",
									required: true,
									defaultValue: () => new Date().toISOString(),
									admin: {
										date: {
											pickerAppearance: "dayOnly",
											displayFormat: DATE_FORMAT,
										},
										width: "50%",
									},
								},
								{
									name: "active_until",
									label: { en: "Active Until", de: "Aktiv Bis" },
									type: "date",
									admin: {
										date: {
											pickerAppearance: "dayOnly",
											displayFormat: DATE_FORMAT,
										},
										width: "50%",
										description:
											"Austrittsdatum aus der StuVe (regelt Kürzel-Verfügbarkeit)",
									},
								},
							],
						},
					],
				},
				{
					label: { en: "Contact", de: "Kontakt" },
					fields: [telephone],
				},
				{
					label: { en: "Discharges", de: "Entlastugnen" },
					fields: [
						{
							name: "discharges",
							label: { en: "Discharges", de: "Entlastungen" },
							type: "array",
							fields: [
								term({ required: true }),
								{
									name: "committee",
									label: { en: "Committee", de: "Gremium" },
									type: "relationship",
									relationTo: "committees",
									filterOptions: ({ id }) => ({
										// term: { equals: (siblingData as any)?.term! }, // can't do that! will reference committees of old terms
										"members.user": { contains: id },
									}),
									required: true,
									admin: {
										condition: (_, { term }) => !!term,
									},
								},
							],
							admin: { components: { RowLabel: DischargeHeader } },
						},
					],
				},
				{
					label: "System",
					fields: [
						{
							name: "role",
							label: { en: "Role", de: "Rolle" },
							type: "select",
							required: true,
							options: [
								{ value: "superadmin", label: "Super-Admin" },
								{ value: "member", label: { en: "Member", de: "Mitglied" } },
							],
						},
					],
				},
			],
		},
	],
};

export default Users;
