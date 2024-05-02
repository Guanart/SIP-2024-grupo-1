import { useEffect, useState } from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event } from '../../types';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '../../components';

export const StartFundraising = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [goalAmount, setGoalAmount] = useState<number | string>('');
	const [initialPrice, setInitialPrice] = useState<number | string>('');
	const [prizePercentage, setPrizePercentage] = useState<number | string>('');
	const [eventId, setEventId] = useState<number | string>('');
	const [playerId, setPlayerId] = useState<number | string>('');
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

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://localhost:3000/event/${user.player.game.id}`,
					});

					if (response.ok) {
						const { events } = await response.json();
						setEvents(events);
						setIsLoading(false);
						setPlayerId(user.player.id);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvents();
	}, [accessToken, isAuthenticated, user]);

	async function handleStartFundraising() {
		console.log('Creating fundraising...');

		const newFundraising = {
			player_id: playerId,
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
					spacing={2}
					sx={{ mt: '16px', maxWidth: '500px' }}
					justifyContent='center'
				>
					<form
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
						}}
					>
						<FormControl>
							<InputLabel id='event'>Event</InputLabel>
							<Select
								labelId='event'
								id='event-select'
								label='Event'
								onChange={(event) =>
									setEventId(Number(event.target.value))
								}
								sx={{ maxWidth: '400px' }}
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
							sx={{ maxWidth: '400px' }}
							type='number'
							onChange={(event) =>
								setGoalAmount(Number(event.target.value))
							}
						/>
						<TextField
							id='prize-percentage'
							value={prizePercentage}
							label='Prize percentage (%)'
							sx={{ maxWidth: '400px' }}
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
							sx={{ maxWidth: '400px' }}
							type='number'
							onChange={(event) =>
								setInitialPrice(Number(event.target.value))
							}
						/>
						<Button
							variant='contained'
							color='secondary'
							onClick={() => handleStartFundraising()}
							sx={{ maxWidth: '400px' }}
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
