import { FunctionComponent, useEffect } from 'react';
import { Header } from './components';
import { useLocation } from 'react-router-dom';
import './PageLayout.css';

type PageLayoutProps = {
	children: React.ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({
	children,
}) => {
	const location = useLocation();
	useEffect(() => {
		let title = '';

		if (location.pathname === '/') {
			title = 'Home';
		} else {
			title = location.pathname.slice(1);
			title = title.charAt(0).toUpperCase() + title.slice(1);
		}

		document.title = `${title} | LOT`;
	}, [location]);

	return (
		<>
			<Header />
			<main>{children}</main>
		</>
	);
};
