import { User, useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';
import { useAccessToken } from '../hooks';
import { useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error } = useAuth0();
	const { permissions, role, accessToken } = useAccessToken();

	useEffect(() => {
		// Verifica si el usuario logueado ya está dado de alta en la API. Caso contrario, envía petición para darlo de alta (es nuevo usuario)
		async function readUserStatus(user: User) {
			try {
				await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/${user.sub}`,
				});
			} catch (error) {
				const account = {
					username: user.nickname,
					email: user.email,
					auth0_id: user.sub,
					avatar: user.picture,
				};

				await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/`,
					method: 'POST',
					data: account,
				});
			}
		}

		if (!user) return;
		if (!accessToken) return;

		readUserStatus(user);
	}, [accessToken, user, isAuthenticated]);

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
		</PageLayout>
	);
};
