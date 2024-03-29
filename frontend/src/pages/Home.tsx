import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';
import { useToken } from '../hooks';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error } = useAuth0();
	const getToken = useToken();

	useEffect(() => {
		if (isAuthenticated) {
			getToken().then((token) => {
				console.log(token);
			});
		}
	}, [getToken, isAuthenticated]);

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
