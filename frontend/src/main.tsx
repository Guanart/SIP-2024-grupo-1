import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './global/index.css';
import {
	About,
	Home,
	Marketplace,
	Trending,
	Wallet,
	Login,
	Error,
	Account,
	Fundraisings,
	Fundraising,
	StartFundraising,
} from './pages';
import { theme } from './global/theme.ts';
import { Protected } from './components';
import { ThemeProvider } from '@mui/material';

const AUTH0_DOMAIN = 'dev-f57qs7dbi1xcl5kj.us.auth0.com';
const AUTH0_CLIENT_ID = 'QDUde2yWkQWxGguu7p59G3QirNNpeXgl';

const privateRoutes = [
	{
		path: `/account/:auth0_id`,
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
		path: '/fundraisings',
		element: <Fundraisings />,
	},
	{
		path: `/fundraising/:id`,
		element: <Fundraising />,
	},
	{
		path: `/fundraising/start`,
		element: <StartFundraising />,
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
		path: '/error/:code',
		element: <Error />,
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
					// useRefreshTokens={true} Remuevo esta opción porque al recargar la página te desloguea y tenes que volver a iniciar sesión
					authorizationParams={{
						redirect_uri: window.location.origin,
						audience: 'http://my-secure-api.com',
						scope: 'read:current_user profile email offline_access ',
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
