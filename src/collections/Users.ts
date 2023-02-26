import { CollectionConfig } from "payload/types";
import { text } from "payload/dist/fields/validations";

const Users: CollectionConfig = {
	slug: "users",
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
									label: "Kürzel",
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
							label: "Fakultät",
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
									label: "Aktiv Seit",
									type: "date",
									required: true,
									defaultValue: () => new Date().toISOString(),
									admin: {
										date: { pickerAppearance: "dayOnly" },
										width: "50%",
									},
								},
								{
									name: "active_until",
									label: "Aktiv Bis",
									type: "date",
									admin: {
										date: { pickerAppearance: "dayOnly" },
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
					label: "Kontakt",
					fields: [
						{
							name: "telephone",
							label: "Telefon",
							type: "text",
							validate: (val, args) =>
								val !== ""
									? /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/.test(
											val
									  ) || "Telefonnummer ist falsch formatiert"
									: text(val, args),
						},
					],
				},
				{
					label: "System",
					fields: [
						{
							name: "role",
							label: "Rolle",
							type: "select",
							required: true,
							options: [
								{ value: "superadmin", label: "Super-Admin" },
								{ value: "member", label: "Mitglied" },
							],
						},
					],
				},
			],
		},
	],
};

export default Users;
