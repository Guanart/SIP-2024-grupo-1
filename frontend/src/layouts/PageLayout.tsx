import { FunctionComponent, useEffect } from 'react';
import { Header } from '../components';
import './PageLayout.css';
import { Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PageLayoutProps = {
	children: React.ReactNode;
	title?: string;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
	children,
	title,
}) => {
	useEffect(() => {
		document.title = title ? `${title} | LOT` : `Home | LOT`;
	}, [title]);

	return (
		<>
			<Header />
			<main
				className={`${
					title?.toLocaleLowerCase().replace(' ', '_') ?? 'home'
				}`}
			>
				{title?.toLocaleLowerCase() !== 'help' && (
					<Typography variant='h5' component='h2'>
						{title}
					</Typography>
				)}
				{children}
				<ToastContainer
					position='bottom-right'
					autoClose={5000}
					pauseOnHover
					theme='dark'
					closeOnClick
				/>
			</main>
		</>
	);
};
