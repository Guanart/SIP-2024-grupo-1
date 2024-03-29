import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import {
	About,
	Fundraising,
	Home,
	Marketplace,
	Trending,
	Wallet,
	Error,
	Account,
} from './pages';
import './index.css';

const AUTH0_DOMAIN = 'dev-f57qs7dbi1xcl5kj.us.auth0.com';
const AUTH0_CLIENT_ID = 'QDUde2yWkQWxGguu7p59G3QirNNpeXgl';

const routes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/about',
		element: <About />,
	},
	{
		path: '/account',
		element: <Account />,
	},
	{
		path: '/marketplace',
		element: <Marketplace />,
	},
	{
		path: '/fundraising',
		element: <Fundraising />,
	},
	{
		path: '/wallet',
		element: <Wallet />,
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
		<BrowserRouter>
			<Auth0Provider
				domain={AUTH0_DOMAIN}
				clientId={AUTH0_CLIENT_ID}
				authorizationParams={{
					redirect_uri: window.location.origin,
				}}
			>
				<Routes>
					{routes.map(({ path, element }) => (
						<Route key={path} path={path} element={element} />
					))}
				</Routes>
			</Auth0Provider>
		</BrowserRouter>
	</React.StrictMode>
);
