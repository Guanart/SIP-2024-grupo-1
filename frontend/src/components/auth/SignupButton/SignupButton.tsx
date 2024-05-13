import { useAuth0 } from '@auth0/auth0-react';
import Button from '@mui/material/Button';
import './SignupButton.css';
import { useTheme } from '@mui/material';

export const SignupButton = () => {
	const { loginWithRedirect } = useAuth0();
	const theme = useTheme();
	return (
		<Button
			variant='contained'
			color='primary'
			sx={{
				fontWeight: 'bold',
				border: `2px solid ${theme.palette.secondary.main}`,
				color: `${theme.palette.secondary.main}`,
			}}
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
