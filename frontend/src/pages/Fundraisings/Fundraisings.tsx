import { PageLayout } from '../../layouts/PageLayout';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import {
	Button,
	Stack,
	TextField,
	Typography,
	Box,
	Card,
	CardMedia,
	CardContent,
} from '@mui/material';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Fundraising, PlayerAnalytic } from '../../types';
import { Loader } from '../../components';
import { Link } from 'react-router-dom';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Fundraisings = () => {
	const { accessToken, role } = useAccessToken();
	const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
	const [analytics, setAnalytics] = useState<PlayerAnalytic>();
	const [currentFundraisings, setCurrentFundraisings] = useState<
		Fundraising[]
	>([]);
	const [filter, setFilter] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { user, isAuthenticated } = useAuth0();

	useEffect(() => {
		async function getFundraisings() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/fundraising`,
				});

				if (response.ok) {
					const { fundraisings } = await response.json();
					setFundraisings(fundraisings);
					setCurrentFundraisings(fundraisings);
				}

				response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/analytics/player/wins`,
				});

				if (response.ok) {
					const data = await response.json();
					setAnalytics(data);
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
			{isLoading && <Loader />}
			{!isLoading && (
				<>
					<Box>
						<Card
							sx={{
								display: 'flex',
								marginTop: '8px',
								marginBottom: '16px',
							}}
						>
							<CardMedia
								component='img'
								sx={{ width: 151 }}
								image={analytics?.player.user.avatar}
								alt={`${analytics?.player.user.username} avatar`}
							/>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<CardContent sx={{ flex: '1 0 auto' }}>
									<Typography
										gutterBottom
										variant='h5'
										component='div'
									>
										{analytics?.description}
									</Typography>
									<Typography variant='h6' color='secondary'>
										{analytics?.player.user.username}
									</Typography>
									<Typography>{analytics?.data}</Typography>
								</CardContent>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										pl: 1,
										pb: 1,
									}}
								>
									<Button
										size='small'
										color='secondary'
										onClick={() => {
											setFilter(
												analytics?.player.user
													.username ?? ''
											);
										}}
									>
										Search his/her tokens
									</Button>
								</Box>
							</Box>
						</Card>
					</Box>
					<Stack spacing={2} mt={4}>
						<Stack
							spacing={4}
							mt={2}
							direction={{ xs: 'column-reverse', md: 'row' }}
						>
							<TextField
								id='filter'
								label='Type to filter fundraisings...'
								variant='outlined'
								value={filter}
								onChange={(event) =>
									setFilter(event.target.value)
								}
								inputProps={{ maxLength: 80 }}
								sx={{ maxWidth: '600px', width: '95%' }}
								type='text'
							/>
							{role === 'player' && (
								<Link
									to='/fundraising/start'
									style={{
										textDecoration: 'none',
										maxWidth: '300px',
										color: 'inherit',
										marginTop: '2px',
									}}
								>
									<Button
										variant='contained'
										color='secondary'
										sx={{
											maxWidth: '300px',
											display: 'block',
											paddingY: '12px',
										}}
									>
										Start a fundraising
									</Button>
								</Link>
							)}
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
								<Typography variant='h6'>
									No active fundraisings found.
								</Typography>
							)}
						</Stack>
					</Stack>
				</>
			)}
		</PageLayout>
	);
};
