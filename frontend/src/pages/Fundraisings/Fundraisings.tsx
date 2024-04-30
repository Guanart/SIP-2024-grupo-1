import { PageLayout } from '../../layouts/PageLayout';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import { Container } from '@mui/material';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Fundraising } from '../../types';

export const Fundraisings = () => {
	const { accessToken } = useAccessToken();
	const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
	const { user, isAuthenticated } = useAuth0();

	useEffect(() => {
		async function getFundraisings() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/fundraising`,
				});

				if (response.ok) {
					const { fundraisings } = await response.json();
					setFundraisings(fundraisings);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getFundraisings();
	}, [accessToken, isAuthenticated, user]);

	return (
		<PageLayout title='Fundraisings'>
			<Container
				sx={{
					marginTop: '18px',
				}}
			>
				{fundraisings.map((fundraising) => {
					return <FundraisingCard fundraising={fundraising} />;
				})}
			</Container>
		</PageLayout>
	);
};
