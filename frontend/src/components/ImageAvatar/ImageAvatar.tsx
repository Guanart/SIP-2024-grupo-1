import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';

export function ImageAvatar() {
	const { user } = useAuth0();

	if (user?.picture) {
		return <Avatar alt={user.name} src={user.picture} />;
	} else {
		let content = 'X';
		if (user && user.name) {
			const words = user.name.split(' ');

			const name = words[0];
			const lastname = words[1];

			content += name.charAt(0);

			if (lastname) content += lastname.charAt(0);
		}
		return <Avatar>{content}</Avatar>;
	}
}
