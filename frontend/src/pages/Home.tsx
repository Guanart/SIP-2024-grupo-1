import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';
import { useAccessToken } from '../hooks';
import Button from '@mui/material/Button';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error } = useAuth0();
	const { permissions, role } = useAccessToken();

	return (
		<PageLayout>
			<h2>Home</h2>
			{isLoading && <div>Loading...</div>}

			{error && <div>Oops... {error.message}</div>}

			{isAuthenticated && (
				<div>
					<pre>
						Logged user data: <br />
						{JSON.stringify(user, null, 2)}
					</pre>
					<pre>
						User account permissions:{' '}
						{JSON.stringify(permissions, null, 2)}
					</pre>
					<pre>User account role: {role}</pre>
				</div>
			)}
			<Button variant='contained'>Hello world MaterialUI</Button>
		</PageLayout>
	);
};
