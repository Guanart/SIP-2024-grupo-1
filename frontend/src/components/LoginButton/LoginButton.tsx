import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import './LoginButton.css';

export const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return (
		<Button
			variant='contained'
			className='login-button'
			color='secondary'
			sx={{
				fontWeight: 'bold',
			}}
			onClick={() => loginWithRedirect()}
		>
			Log in
		</Button>
	);
};
