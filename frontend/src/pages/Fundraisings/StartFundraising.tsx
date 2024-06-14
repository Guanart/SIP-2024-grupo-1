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
	Container,
	Box,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event, AverageTokenPriceAnalytics } from '../../types';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '../../components';
import { User } from '../../types';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const StartFundraising = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [goalAmount, setGoalAmount] = useState<number | string>('');
	const [initialPrice, setInitialPrice] = useState<number | string>('');
	const [prizePercentage, setPrizePercentage] = useState<number | string>('');
	const [eventId, setEventId] = useState<number | string>('');
	const [eventName, setEventName] = useState<string>('');
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [averageTokenPrice, setAverageTokenPrice] =
		useState<AverageTokenPriceAnalytics | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		async function getEvents() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/user/${user?.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();
					setCurrentUser(user);
					console.log(user);

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/event/${user.player.game.id}`,
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

	useEffect(() => {
		const event = events.filter((event) => event.id === eventId);
		if (!event.length) return;

		const eventName = event[0]['name'];

		fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `${HOST}:${PORT}/analytics/token/average?event_name=${eventName}`,
		})
			.then((response) => response.json())
			.then((data) => {
				setAverageTokenPrice(data.average);
				setEventName(eventName);
			});
	}, [eventId, events, accessToken, isAuthenticated]);

	async function handleStartFundraising(event: FormEvent) {
		event.preventDefault();

		const newFundraising = {
			player_id: currentUser?.player?.id,
			event_id: eventId,
			goal_amount: Number(goalAmount),
			prize_percentage: Number(prizePercentage),
			initial_price: Number(initialPrice),
		};

		try {
			console.log(newFundraising);
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/fundraising`,
				method: 'POST',
				data: newFundraising,
			});

			if (response.ok) {
				const { fundraising } = await response.json();
				navigate(`/fundraising/${fundraising.id}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('Internal Server Error')) {
					navigate('/error/500');
				}
				toast.error(error.message);
			} else {
				navigate('/error/500');
			}
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
					spacing={4}
					sx={{ mt: '16px', maxWidth: '1400px' }}
					justifyContent='center'
					direction={{ xs: 'column-reverse', lg: 'row' }}
				>
					<Container sx={{ maxWidth: '400px !important' }}>
						<Typography
							color='secondary'
							sx={{ fontWeight: 'bold', paddingBottom: '8px' }}
						>
							Token preview
						</Typography>
						<Card
							sx={{
								maxWidth: 345,
								width: 345,
								borderColor: 'secondary',
							}}
						>
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
										{currentUser?.player?.rank.description}
									</Typography>
								</Typography>
								<Typography component='div'>
									Game
									<Typography
										color='secondary'
										component='div'
										sx={{
											display: 'inline-flex',
											marginLeft: '6px',
											fontWeight: 'bold',
											alignItems: 'center',
											gap: '8px',
										}}
									>
										{currentUser?.player?.game.name}
										<img
											style={{ display: 'inline' }}
											width='35px'
											height='25px'
											src={currentUser?.player?.game.icon}
											alt={`${currentUser?.player?.game.name} icon`}
										/>
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
									<MenuItem
										key={event.id}
										value={event.id}
										id={event.id.toString()}
									>
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
							onChange={(event) => {
								const value = Number(event.target.value);
								if (value < 0) {
									setGoalAmount(0);
								} else {
									setGoalAmount(event.target.value);
								}
							}}
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
								} else if (value < 0) {
									setPrizePercentage(0);
								} else {
									setPrizePercentage(event.target.value);
								}
							}}
						/>
						<TextField
							id='initial-price'
							value={initialPrice}
							label='Token initial price (U$D)'
							sx={{ maxWidth: '400px', width: '90%' }}
							type='number'
							onChange={(event) => {
								const value = Number(event.target.value);
								if (value < 0) {
									setInitialPrice(0);
								} else {
									setInitialPrice(event.target.value);
								}
							}}
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
								Number(goalAmount) < Number(initialPrice)
							}
						>
							Start fundraising
						</Button>
					</form>
					<Stack direction='column' spacing={2}>
						{averageTokenPrice && (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									minWidth: '300px',
									height: 'auto',
									gap: '16px',
								}}
							>
								<Typography
									sx={{
										fontWeight: 'bold',
										textDecoration: 'underline',
									}}
									color='secondary'
									variant='h6'
								>
									Average token price
								</Typography>
								<Box>
									<Typography
										sx={{
											fontWeight: 'bold',
											fontSize: '18px',
										}}
										color='secondary'
									>
										Global average token price
									</Typography>
									<Typography sx={{ fontWeight: 'bold' }}>
										U$D {averageTokenPrice.averagePrice}
									</Typography>
								</Box>
								<Box>
									<Typography
										sx={{
											fontWeight: 'bold',
											fontSize: '18px',
										}}
										color='secondary'
									>
										Event average token price
									</Typography>
									{averageTokenPrice.averagePriceByEdition && (
										<Typography sx={{ fontWeight: 'bold' }}>
											U$D{' '}
											{
												averageTokenPrice.eventAveragePrice
											}
										</Typography>
									)}
									{!averageTokenPrice.averagePriceByEdition && (
										<Typography
											sx={{
												fontSize: '14px',
												marginTop: '8px',
											}}
										>
											There is insufficient data to
											provide a value
										</Typography>
									)}
								</Box>
								<Box>
									<Typography
										sx={{
											fontWeight: 'bold',
											fontSize: '18px',
										}}
										color='secondary'
									>
										Last {eventName} editions
									</Typography>
									<Typography
										sx={{ fontSize: '14px' }}
									></Typography>
									<TableContainer
										sx={{
											maxWidth: '400px',
											minWidth: '350px',
										}}
									>
										<Table
											aria-label='a dense table'
											size='small'
										>
											<TableHead>
												<TableRow>
													<TableCell align='center'>
														#
													</TableCell>
													<TableCell align='center'>
														Date
													</TableCell>
													<TableCell
														align='center'
														sx={{
															maxWidth: '80px',
														}}
													>
														Min.
													</TableCell>
													<TableCell
														align='center'
														sx={{
															maxWidth: '80px',
														}}
													>
														Max.
													</TableCell>
													<TableCell
														align='center'
														sx={{
															maxWidth: '80px',
														}}
													>
														Avg.
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{averageTokenPrice.eventAveragePrice &&
													Object.entries(
														averageTokenPrice.averagePriceByEdition
													).map(
														(
															[key, value],
															index
														) => {
															return (
																<TableRow
																	sx={{
																		'&:last-child td, &:last-child th':
																			{
																				border: 0,
																			},
																	}}
																	key={key}
																>
																	<TableCell
																		align='center'
																		component='th'
																		scope='row'
																	>
																		{index +
																			1}
																	</TableCell>
																	<TableCell
																		align='center'
																		component='th'
																		scope='row'
																	>
																		{new Date(
																			value.date
																		).getUTCMonth() +
																			1}
																		/
																		{new Date(
																			value.date
																		).getFullYear()}
																	</TableCell>
																	<TableCell
																		align='center'
																		sx={{
																			fontWeight:
																				'bold',
																		}}
																	>
																		U$D{' '}
																		{
																			value.min
																		}
																	</TableCell>
																	<TableCell
																		align='center'
																		sx={{
																			fontWeight:
																				'bold',
																		}}
																	>
																		U$D{' '}
																		{
																			value.max
																		}
																	</TableCell>
																	<TableCell
																		align='center'
																		sx={{
																			fontWeight:
																				'bold',
																		}}
																	>
																		<Typography
																			color='secondary'
																			sx={{
																				fontWeight:
																					'bold',
																			}}
																		>
																			U$D{' '}
																			{
																				value.average
																			}
																		</Typography>
																	</TableCell>
																</TableRow>
															);
														}
													)}
											</TableBody>
										</Table>
									</TableContainer>
									{!averageTokenPrice.eventAveragePrice && (
										<Typography
											sx={{
												fontSize: '14px',
												marginTop: '8px',
												textAlign: 'center',
											}}
										>
											There is insufficient data to
											provide a value
										</Typography>
									)}
								</Box>
							</Box>
						)}
					</Stack>
				</Stack>
			)}
		</PageLayout>
	);
};
