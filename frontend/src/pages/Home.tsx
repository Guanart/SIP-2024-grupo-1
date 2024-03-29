import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error } = useAuth0();

	return (
		<PageLayout>
			<h2>Home</h2>

			{isLoading && <div>Loading...</div>}

			{error && <div>Oops... {error.message}</div>}

			{isAuthenticated && (
				<div>
					<p>User data: </p>
					<pre> {JSON.stringify(user, null, 2)}</pre>
				</div>
			)}
		</PageLayout>
	);
};
