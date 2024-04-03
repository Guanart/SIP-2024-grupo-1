import { PageLayout } from '../layouts/PageLayout';
import { SignupButton, LoginButton } from '../components';

export const Login = () => {
	console.log('LOGIN');
	return (
		<PageLayout>
			<h2>Login</h2>
			<p>
				Welcome to the login page. Here you can login to your account.
			</p>
			<LoginButton />
			<SignupButton />
		</PageLayout>
	);
};
