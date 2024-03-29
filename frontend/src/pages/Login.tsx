import { PageLayout } from '../layouts/PageLayout';
import { LoginButton } from '../components/LoginButton/LoginButton';

export const Login = () => {
	return (
		<PageLayout>
			<h2>Login</h2>
			<p>
				Welcome to the login page. Here you can login to your account.
			</p>
			<LoginButton />
		</PageLayout>
	);
};
