import { useAuth0 } from '@auth0/auth0-react';
import './LogoutButton.css';

export const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<button className='logout-button' onClick={() => logout()}>
			Logout
		</button>
	);
};
