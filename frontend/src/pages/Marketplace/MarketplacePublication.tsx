import { useParams } from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import { Typography } from '@mui/material';

export const MarketplacePublication = () => {
	const { publication_id } = useParams();
	return (
		<PageLayout title='Marketplace publication'>
			<Typography>Publication ID: {publication_id}</Typography>
		</PageLayout>
	);
};
