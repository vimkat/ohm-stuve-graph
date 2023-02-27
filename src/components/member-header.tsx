import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, useConfig, useLocale } from "payload/components/utilities";

import Users from "../collections/Users";
import { lookupMemberPosition } from "../fields/member-position";

const MemberHeader = ({ data }) => {
	const { user: userID, position } = data;
	const {
		serverURL,
		routes: { api },
	} = useConfig();
	const [username, setUsername] = useState<string>();
	const { i18n } = useTranslation();

	useEffect(() => {
		// Nothing to do when no user is selected
		if (!userID) {
			setUsername("");
			return;
		}

		fetch(`${serverURL}${api}/${Users.slug}/${userID}`)
			.then((res) => res.json())
			.then((user) => setUsername(user.name))
			.catch((_) => setUsername(i18n.t("errors:fetch")));
	}, [userID]);

	if (!username) return;

	return (
		username +
		((position && ` (${lookupMemberPosition(position)[i18n.language]})`) || "")
	);
};

export default MemberHeader;
