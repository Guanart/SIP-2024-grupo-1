import { Link } from 'react-router-dom';
import { PageLayout } from '../layouts/PageLayout';

export const Error = () => {
	return (
		<PageLayout>
			<h2>Error 404</h2>
			<h3>Page not found</h3>
			<Link to='/'>Back to home</Link>
		</PageLayout>
	);
};
