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
			<Button variant='contained'>Hello world MaterialUI</Button>
		</PageLayout>
	);
};
