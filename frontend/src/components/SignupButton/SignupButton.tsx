import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import './SignupButton.css';

export const SignupButton = () => {
	const { loginWithRedirect } = useAuth0();

	return (
		<Button
			variant='outlined'
			color='secondary'
			className='signup-button'
			onClick={() =>
				loginWithRedirect({
					authorizationParams: {
						prompt: 'login',
						screen_hint: 'signup',
					},
				})
			}
		>
			Sign up
		</Button>
	);
};
