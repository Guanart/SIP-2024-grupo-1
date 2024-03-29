import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
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
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
