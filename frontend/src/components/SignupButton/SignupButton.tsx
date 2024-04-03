import { useAuth0 } from '@auth0/auth0-react';
import './SignupButton.css';

export const SignupButton = () => {
	const { loginWithRedirect } = useAuth0();

	return (
		<button
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
		</button>
	);
};
