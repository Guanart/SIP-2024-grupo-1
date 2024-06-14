import { List, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MarketplacePublication } from '../../types';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, useAuth0 } from '@auth0/auth0-react';
import { MarketplaceCard } from '../marketplace/MarketplaceCard';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const PublicationList = () => {
	const [publications, setPublications] = useState<MarketplacePublication[]>(
		[]
	);
	const { accessToken } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const navigate = useNavigate();
	const { auth0_id } = useParams();

	useEffect(() => {
		async function getUserMarketplacePublications(user: User) {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/user/${user.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/marketplace/user/${user.wallet.id}`,
					});

					if (response.ok) {
						const { publications } = await response.json();

						setPublications(publications);
					} else {
						navigate('/error/500');
					}
				} else {
					navigate('/error/500');
				}
			} catch (error) {
				console.log('error3');
				console.log(error);
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getUserMarketplacePublications(user);
	}, [accessToken, isAuthenticated, user, navigate, auth0_id]);

	if (publications.length === 0) {
		return (
			<>
				<Typography component='p' sx={{ paddingTop: '16px' }}>
					You don't have any active marketplace publication yet!
				</Typography>
				<Link
					to={`/marketplace`}
					style={{
						textDecoration: 'none',
						color: '#45FFCA',
						padding: '16px 0',
						fontWeight: 'bold',
					}}
				>
					Go to marketplace
				</Link>
			</>
		);
	}

	return (
		<>
			<List sx={{ width: '100%', maxWidth: 360 }}>
				{publications.map((publication) => (
					<MarketplaceCard
						key={publication.publication_id}
						publication={publication}
					/>
				))}
			</List>
			<Link
				to={`/marketplace`}
				style={{
					textDecoration: 'none',
					color: '#45FFCA',
				}}
			>
				Go to marketplace
			</Link>
		</>
	);
};
