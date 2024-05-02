import { FormEvent, useEffect, useState } from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import {
	Button,
	Card,
	CardContent,
	CardMedia,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event } from '../../types';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '../../components';
import { User } from '../../types';
import { Container } from '@mui/material';

export const StartFundraising = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [goalAmount, setGoalAmount] = useState<number | string>('');
	const [initialPrice, setInitialPrice] = useState<number | string>('');
	const [prizePercentage, setPrizePercentage] = useState<number | string>('');
	const [eventId, setEventId] = useState<number | string>('');
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function getEvents() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/${user?.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();
					setCurrentUser(user);
					console.log(user);

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://localhost:3000/event/${user.player.game.id}`,
					});

					if (response.ok) {
						const { events } = await response.json();
						setEvents(events);
						setIsLoading(false);
					}
				}
			} catch (error) {
				navigate(`/error/500`);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvents();
	}, [accessToken, isAuthenticated, user, navigate]);

	async function handleStartFundraising(event: FormEvent) {
		console.log('Creating fundraising...');
		event.preventDefault();

		const newFundraising = {
			player_id: currentUser?.player?.id,
			event_id: eventId,
			goal_amount: goalAmount,
			prize_percentage: prizePercentage,
			initial_price: initialPrice,
		};

		try {
			console.log(newFundraising);
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://localhost:3000/fundraising`,
				method: 'POST',
				data: newFundraising,
			});

			if (response.ok) {
				const { message, fundraising } = await response.json();
				console.log(message);
				navigate(`/fundraising/${fundraising.id}`);
			}
		} catch (error) {
			navigate(`/error`);
		}
	}

	return (
		<PageLayout title='Start your fundraising'>
			<Link to={`/fundraisings`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>

			{isLoading && <Loader />}
			{!isLoading && (
				<Stack
					spacing={{ xs: 4, md: 8 }}
					sx={{ mt: '16px', maxWidth: '900px' }}
					justifyContent='center'
					direction={{ xs: 'column-reverse', md: 'row' }}
				>
					<Container>
						<Typography
							color='secondary'
							sx={{ fontWeight: 'bold', paddingBottom: '8px' }}
						>
							Token preview
						</Typography>
						<Card sx={{ maxWidth: 345, borderColor: 'secondary' }}>
							<CardMedia
								sx={{ height: 140 }}
								image={currentUser?.avatar}
								title={currentUser?.username}
							/>
							<CardContent>
								<Typography
									gutterBottom
									variant='h5'
									component='h3'
								>
									{currentUser?.username}
								</Typography>
								<Typography variant='body2'>
									{currentUser?.player?.biography}
								</Typography>
								<Typography
									component='div'
									sx={{ marginTop: '8px' }}
								>
									Ranking
									<Typography
										color='secondary'
										component='div'
										sx={{
											display: 'inline',
											marginLeft: '6px',
											fontWeight: 'bold',
										}}
									>
										{currentUser?.player?.ranking}
									</Typography>
								</Typography>
								<Typography component='div'>
									Game
									<Typography
										color='secondary'
										component='div'
										sx={{
											display: 'inline',
											marginLeft: '6px',
											fontWeight: 'bold',
										}}
									>
										{currentUser?.player?.game.name}
									</Typography>
								</Typography>
								<Typography component='div'>
									Event
									<Typography
										color='secondary'
										component='div'
										sx={{
											display: 'inline',
											marginLeft: '6px',
											fontWeight: 'bold',
										}}
									>
										{events
											.filter(
												(event) => event.id === eventId
											)
											.map((event) => event.name)}
									</Typography>
								</Typography>
							</CardContent>
						</Card>
					</Container>
					<form
						onSubmit={(event) => handleStartFundraising(event)}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
							minWidth: '400px',
							marginTop: '24px',
							...(window.innerWidth <= 900 && {
								marginTop: '0px', // Cambiar el marginTop para pantallas pequeñas
							}),
						}}
					>
						<Typography variant='h6'>New fundraising</Typography>
						<FormControl>
							<InputLabel id='event'>Event</InputLabel>
							<Select
								labelId='event'
								id='event-select'
								label='Event'
								onChange={(event) =>
									setEventId(Number(event.target.value))
								}
								sx={{ maxWidth: '400px', width: '90%' }}
							>
								{events.map((event) => (
									<MenuItem key={event.id} value={event.id}>
										{event.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							id='goal-amount'
							value={goalAmount}
							label='Goal amount (U$D)'
							sx={{ maxWidth: '400px', width: '90%' }}
							type='number'
							onChange={(event) =>
								setGoalAmount(Number(event.target.value))
							}
						/>
						<TextField
							id='prize-percentage'
							value={prizePercentage}
							label='Prize percentage (%)'
							sx={{ maxWidth: '400px', width: '90%' }}
							type='number'
							inputProps={{ maxLength: 3, max: 100 }}
							onChange={(event) => {
								const value = Number(event.target.value);
								if (value > 100) {
									setPrizePercentage(100);
								} else {
									setPrizePercentage(value);
								}
							}}
						/>
						<TextField
							id='initial-price'
							value={initialPrice}
							label='Token initial price (U$D)'
							sx={{ maxWidth: '400px', width: '90%' }}
							type='number'
							onChange={(event) =>
								setInitialPrice(Number(event.target.value))
							}
						/>
						<Button
							variant='contained'
							color='secondary'
							type='submit'
							sx={{ maxWidth: '400px', width: '90%' }}
							disabled={
								!goalAmount ||
								!initialPrice ||
								!eventId ||
								goalAmount < initialPrice
							}
						>
							Start fundraising
						</Button>
					</form>
				</Stack>
			)}
		</PageLayout>
	);
};
