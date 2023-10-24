import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useConfig } from "payload/components/utilities";
import Committees from "../collections/Committees";
import { lookupTerm } from "../fields/term";

const DischargeHeader = ({ data }) => {
	const { committee: committeeID, term: termNumber } = data;
	const {
		serverURL,
		routes: { api },
	} = useConfig();
	const [committee, setCommittee] = useState<string>();
	const { i18n } = useTranslation();

	useEffect(() => {
		// Nothing to do when no committee is selected
		if (!committeeID) {
			setCommittee(null);
			return;
		}

		fetch(`${serverURL}${api}/${Committees.slug}/${committeeID}`)
			.then((res) => res.json())
			.then((com) => setCommittee(com.name))
			.catch((_) => setCommittee(i18n.t("errors:fetch")));
	}, [committeeID]);

	if (!committee || !termNumber) return;
	return `${committee} | ${lookupTerm(termNumber)}`;
};

export default DischargeHeader;
