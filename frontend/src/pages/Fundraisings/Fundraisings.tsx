import { PageLayout } from '../../layouts/PageLayout';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import { Container } from '@mui/material';

export const Fundraisings = () => {
	return (
		<PageLayout title='Fundraisings'>
			<Container
				sx={{
					marginTop: '18px',
				}}
			>
				<FundraisingCard />
			</Container>
		</PageLayout>
	);
};
