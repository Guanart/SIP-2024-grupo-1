import { PageLayout } from '../../layouts/PageLayout';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import { Container, Stack, TextField, Typography } from '@mui/material';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Fundraising } from '../../types';
import { Loader } from '../../components';

export const Fundraisings = () => {
	const { accessToken } = useAccessToken();
	const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
	const [currentFundraisings, setCurrentFundraisings] = useState<
		Fundraising[]
	>([]);
	const [filter, setFilter] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

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
					setCurrentFundraisings(fundraisings);
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getFundraisings();
	}, [accessToken, isAuthenticated, user]);

	useEffect(() => {
		if (filter) {
			const value = filter.trim().toLowerCase();
			const nextFilteredFundraisings = fundraisings.filter(
				(fundraising) => {
					const event = fundraising.event.name.toLowerCase();
					const username =
						fundraising.player.user.username.toLowerCase();
					const game = fundraising.player.game.name.toLowerCase();
					return (
						game.includes(value) ||
						event.includes(value) ||
						username.includes(value)
					);
				}
			);
			setCurrentFundraisings(nextFilteredFundraisings);
		} else {
			setCurrentFundraisings(fundraisings);
		}
	}, [filter, fundraisings]);

	return (
		<PageLayout title='Fundraisings'>
			{!isLoading ? (
				<Stack spacing={4} mt={2}>
					<TextField
						id='filter'
						label='Type to filter fundraisings...'
						variant='outlined'
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
						inputProps={{ maxLength: 80 }}
						sx={{ maxWidth: '600px', width: '95%' }}
						type='text'
					/>
					<Container
						sx={{
							marginTop: '18px',
						}}
					>
						{currentFundraisings.length > 0 ? (
							currentFundraisings.map((fundraising) => {
								return (
									<FundraisingCard
										fundraising={fundraising}
										key={fundraising.id}
									/>
								);
							})
						) : (
							<Typography>
								No fundraisings match your search.
							</Typography>
						)}
					</Container>
				</Stack>
			) : (
				<Loader />
			)}
		</PageLayout>
	);
};
