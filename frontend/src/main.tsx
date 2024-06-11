import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import './global/index.css';
import {
	Help,
	Home,
	Marketplace,
	Wallet,
	Login,
	Error,
	Account,
	Fundraisings,
	Fundraising,
	StartFundraising,
	UpdateFundraising,
	RequestForm,
	RequestSuccess,
	CreatePublication,
	MarketplacePublication,
	TermsConditions,
	VerificationRequests,
	Administration,
	Events,
	Event,
	Games,
} from './pages';
import { theme } from './global/theme.ts';
import { Protected } from './components';
import { ThemeProvider } from '@mui/material';

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
	{
		path: `/fundraising/update/:fundraising_id`,
		element: <UpdateFundraising />,
	},
	{
		path: `/marketplace/publication/create/:token_id`,
		element: <CreatePublication />,
	},
	{
		path: `/marketplace/publication/:publication_id`,
		element: <MarketplacePublication />,
	},
	{
		path: `/sendPlayerRequest`,
		element: <RequestForm />,
	},
	{
		path: `/requestSuccess`,
		element: <RequestSuccess />,
	},
	{
		path: `/requests`,
		element: <VerificationRequests />,
	},
	{
		path: `/events`,
		element: <Events />,
	},
	{
		path: `/event/:event_id`,
		element: <Event />,
	},
	{
		path: `/games`,
		element: <Games />,
	},
	{
		path: '/administration',
		element: <Administration />,
	},
];

const publicRoutes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/help',
		element: <Help />,
	},
	{
		path: '/terms',
		element: <TermsConditions />,
	},
	{
		path: '/login',
		element: <Login />,
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

const AUTH0_AUDIENCE = import.meta.env.APP_AUTH0_AUDIENCE;
const AUTH0_DOMAIN = import.meta.env.APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.APP_AUTH0_CLIENT_ID;
console.log('AUTH0_AUDIENCE: ' + AUTH0_AUDIENCE);
console.log('AUTH0_DOMAIN: ' + AUTH0_DOMAIN);
console.log('AUTH0_CLIENT_ID: ' + AUTH0_CLIENT_ID);

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
						audience: AUTH0_AUDIENCE,
						scope: 'read:current_user profile email offline_access ',
					}}
					cacheLocation='localstorage'
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
