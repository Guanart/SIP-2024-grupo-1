import { useParams } from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import { Typography } from '@mui/material';

export const CreatePublication = () => {
	const { token_id } = useParams();
	return (
		<PageLayout title='Create marketplace publication'>
			<Typography>Token ID: {token_id}</Typography>
		</PageLayout>
	);
};
