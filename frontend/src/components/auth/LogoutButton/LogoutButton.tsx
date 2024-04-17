import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import './LogoutButton.css';

export const LogoutButton = () => {
	const { logout } = useAuth0();

	return (
		<Button
			variant='contained'
			color='secondary'
			className='logout-button'
			onClick={() => logout()}
		>
			Log out
		</Button>
	);
};
