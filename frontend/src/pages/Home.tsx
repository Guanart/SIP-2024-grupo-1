import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../layouts/PageLayout';
import { useAccessToken } from '../hooks';
import Button from '@mui/material/Button';

export const Home = () => {
	const { user, isAuthenticated, isLoading, error } = useAuth0();
	const [message, setMessage] = useState<string>('');
	const [path, setPath] = useState<string>('/');
	const { accessToken, permissions, role } = useAccessToken();

	async function makeRequest() {
		if (isAuthenticated) {
			try {
				const url = `http://localhost:3000${path}`;

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
								name='path'
								checked={path === '/'}
								onChange={(e) => {
									setPath(e.target.value);
								}}
							/>
							<label htmlFor='/'>/</label>
						</p>
						<p>
							<input
								id='/user'
								type='radio'
								value='/user'
								name='path'
								checked={path === '/user'}
								onChange={(e) => {
									setPath(e.target.value);
								}}
							/>
							<label htmlFor='/user'>/user</label>
						</p>
						<p>
							<input
								id='/player'
								type='radio'
								value='/player'
								name='path'
								checked={path === '/player'}
								onChange={(e) => {
									setPath(e.target.value);
								}}
							/>
							<label htmlFor='/player'>/player</label>
						</p>
						<p>
							<input
								id='/admin'
								type='radio'
								value='/admin'
								name='path'
								checked={path === '/admin'}
								onChange={(e) => {
									setPath(e.target.value);
								}}
							/>
							<label htmlFor='/admin'>/admin</label>
						</p>
						<Button variant="contained" onClick={() => {
							makeRequest();
						}}>Make request to {path}</Button>
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
