import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';
// import { useToken } from '../hooks';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } =
		useAuth0();
	const [message, setMessage] = useState<string>('');
	const [role, setRole] = useState<string>('/');

	async function makeRequest() {
		if (isAuthenticated) {
			try {
				const accessToken = await getAccessTokenSilently({
					authorizationParams: {
						audience: `http://my-secure-api.com`,
						scope: 'read:current_user',
					},
				});

				const url = `http://localhost:3000${role}`;

				const response = await fetch(url, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});

				const data = await response.json();

				if (data.message) {
					setMessage(data.message);
				} else {
					setMessage(`${data.status}: ${data.inner.message}`);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

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

			{isAuthenticated && (
				<>
					<br />
					<hr />
					<br />
					<div>
						<p>
							<input
								id='/'
								type='radio'
								value='/'
								name='role'
								checked={role === '/'}
								onChange={(e) => {
									setRole(e.target.value);
								}}
							/>
							<label htmlFor='/'>/</label>
						</p>
						<p>
							<input
								id='/user'
								type='radio'
								value='/user'
								name='role'
								checked={role === '/user'}
								onChange={(e) => {
									setRole(e.target.value);
								}}
							/>
							<label htmlFor='/user'>/user</label>
						</p>
						<p>
							<input
								id='/player'
								type='radio'
								value='/player'
								name='role'
								checked={role === '/player'}
								onChange={(e) => {
									setRole(e.target.value);
								}}
							/>
							<label htmlFor='/player'>/player</label>
						</p>
						<p>
							<input
								id='/admin'
								type='radio'
								value='/admin'
								name='role'
								checked={role === '/admin'}
								onChange={(e) => {
									setRole(e.target.value);
								}}
							/>
							<label htmlFor='/admin'>/admin</label>
						</p>
						<button
							onClick={() => {
								makeRequest();
							}}
						>
							Make request to {role}
						</button>

						{message && (
							<div>
								<p>Message from the server: {message}</p>
							</div>
						)}
					</div>
				</>
			)}
		</PageLayout>
	);
};
