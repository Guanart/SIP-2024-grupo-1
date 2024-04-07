import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './global/index.css';
import {
	About,
	Fundraising,
	Home,
	Marketplace,
	Trending,
	Wallet,
	Login,
	Error,
	Account,
} from './pages';
import { theme } from './global/theme.ts';
import Protected from './utils/Protected';
import { ThemeProvider } from '@mui/material';

const AUTH0_DOMAIN = 'dev-f57qs7dbi1xcl5kj.us.auth0.com';
const AUTH0_CLIENT_ID = 'QDUde2yWkQWxGguu7p59G3QirNNpeXgl';
const privateRoutes = [
	{
		path: '/account',
		element: <Account />,
	},
	{
		path: '/wallet',
		element: <Wallet />,
	},
	{
		path: '/marketplace',
		element: <Marketplace />,
	},
	{
		path: '/fundraising',
		element: <Fundraising />,
	},
];

const publicRoutes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/about',
		element: <About />,
	},
	{
		path: '/login',
		element: <Login />,
	},

	{
		path: '/trending',
		element: <Trending />,
	},
	{
		path: '*',
		element: <Error />,
	},
];

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Auth0Provider
					domain={AUTH0_DOMAIN}
					clientId={AUTH0_CLIENT_ID}
					authorizationParams={{
						redirect_uri: window.location.origin,
						audience: 'http://my-secure-api.com',
					}}
				>
					<Routes>
						<Route element={<Protected />}>
							{privateRoutes.map(({ path, element }) => (
								<Route
									key={path}
									path={path}
									element={element}
								/>
							))}
						</Route>
						{publicRoutes.map(({ path, element }) => (
							<Route key={path} path={path} element={element} />
						))}
					</Routes>
				</Auth0Provider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
