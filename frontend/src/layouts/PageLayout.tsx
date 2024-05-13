import { FunctionComponent, useEffect } from 'react';
import { Header } from '../components';
import './PageLayout.css';
import { Typography } from '@mui/material';

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
			<main className={`${title ?? 'home'}`}>
				{title && (
					<Typography variant='h5' component='h2'>
						{title}
					</Typography>
				)}
				{children}
			</main>
		</>
	);
};
