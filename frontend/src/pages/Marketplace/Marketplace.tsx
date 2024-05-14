import { PageLayout } from '../../layouts/PageLayout';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { MarketplacePublication } from '../../types';
import { Loader, MarketplaceCard } from '../../components';

export const Marketplace = () => {
	const { accessToken } = useAccessToken();
	const [publications, setPublications] = useState<MarketplacePublication[]>(
		[]
	);
	const [currentPublications, setCurrentPublications] = useState<
		MarketplacePublication[]
	>([]);
	const [min, setMin] = useState<string>('');
	const [max, setMax] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { user, isAuthenticated } = useAuth0();

	useEffect(() => {
		async function getMarketplacePublications() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/marketplace`,
				});

				if (response.ok) {
					const { publications } = await response.json();
					setPublications(publications);
					setCurrentPublications(publications);
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getMarketplacePublications();
	}, [accessToken, isAuthenticated, user]);

	useEffect(() => {
		if (min || max) {
			const nextFilteredPublications = publications.filter(
				(publication) => {
					const minPrice = min ? Number(min) : 0;
					const maxPrice = max ? Number(max) : 100000;
					return (
						publication.price >= minPrice &&
						publication.price <= maxPrice
					);
				}
			);

			setCurrentPublications(nextFilteredPublications);
		} else {
			setCurrentPublications(publications);
		}
	}, [publications, min, max]);

	return (
		<PageLayout title='Marketplace'>
			{isLoading && <Loader />}
			{!isLoading && (
				<Stack spacing={4} mt={2}>
					<Stack
						spacing={1}
						mt={2}
						direction={{ xs: 'column-reverse', md: 'row' }}
					>
						<TextField
							autoComplete='off'
							id='min'
							label='Min price (U$D)'
							variant='outlined'
							value={min}
							onChange={(event) => setMin(event.target.value)}
							sx={{ maxWidth: '200px', width: '95%' }}
							type='text'
						/>
						<TextField
							autoComplete='off'
							id='max'
							label='Max price (U$D)'
							variant='outlined'
							value={max}
							onChange={(event) => setMax(event.target.value)}
							sx={{ maxWidth: '200px', width: '95%' }}
							type='text'
						/>
						<Button
							color='secondary'
							size='small'
							onClick={() => {
								setMin('');
								setMax('');
							}}
						>
							Clear
						</Button>
					</Stack>
					<Stack
						sx={{
							marginTop: '18px',
							width: '100%',
							alignItems: 'center',
							flexWrap: 'wrap',
							display: 'flex',
							gap: '16px',
							justifyContent: 'flex-start',
							flexDirection: 'row',
							...(window.innerWidth <= 770 && {
								justifyContent: 'center',
							}),
						}}
					>
						{currentPublications.length > 0 ? (
							currentPublications.map((publication) => {
								return (
									<MarketplaceCard
										publication={publication}
										key={publication.publication_id}
									/>
								);
							})
						) : (
							<Typography variant='h6'>
								No active marketplace publications found.
							</Typography>
						)}
					</Stack>
				</Stack>
			)}
		</PageLayout>
	);
};
