import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Event, Game } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks/useAccessToken';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import './Admin.css';
import { Loader } from '../../components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Events = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState<Dayjs>(dayjs(''));
	const [endDate, setEndDate] = useState<Dayjs>(dayjs(''));
	const [maxPlayers, setMaxPlayers] = useState<string | number>('');
	const [prize, setPrize] = useState<string | number>('');
	const [gameId, setGameId] = useState<number | string>('');
	const [events, setEvents] = useState<Event[]>([]);
	const [games, setGames] = useState<Game[]>([]);
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();

	async function handleRegister(event: FormEvent) {
		event.preventDefault();

		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/event`,
				method: 'POST',
				data: {
					name,
					game_id: Number(gameId),
					prize: Number(prize),
					max_players: Number(maxPlayers),
					end_date: endDate.toDate(),
					start_date: startDate.toDate(),
				},
			});

			toast.success('New event created successfully');

			setName('');
			setGameId('');
			setMaxPlayers('');
			setPrize('');
			setStartDate(dayjs(''));
			setEndDate(dayjs(''));
			setIsCreating(false);
			getEvents();
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

	const getEvents = useCallback(async () => {
		try {
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/event`,
			});

			if (response.ok) {
				const { events } = await response.json();
				console.log(events);
				setEvents(events);
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	}, [accessToken, isAuthenticated]);

	useEffect(() => {
		async function getGames() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/game`,
				});

				if (response.ok) {
					const { games } = await response.json();
					setGames(games);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvents();
		getGames();
	}, [accessToken, isAuthenticated, user, getEvents]);

	return (
		<PageLayout title='Events'>
			<Link to={`/administration`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			{isLoading && <Loader />}
			{!isLoading && (
				<>
					<Box>
						{!isCreating && (
							<Button
								size='small'
								color='secondary'
								variant='contained'
								onClick={() => setIsCreating(!isCreating)}
							>
								Register new event
							</Button>
						)}
						<Stack sx={{ marginTop: '16px' }}>
							{isCreating && (
								<form
									style={{
										gap: '12px',
										display: 'flex',
										flexWrap: 'wrap',
										maxWidth: '800px',
									}}
									onSubmit={(event) => handleRegister(event)}
								>
									<TextField
										id='event-name'
										label='Name'
										variant='outlined'
										value={name}
										onChange={(event) => {
											const name = event.target.value;
											setName(name);
										}}
										autoComplete='off'
										sx={{
											minWidth: '300px',
											maxWidth: '300px',
										}}
										inputProps={{ maxLength: 120 }}
									/>
									<FormControl>
										<InputLabel>Game</InputLabel>
										<Select
											labelId='event'
											id='event-game-select'
											label='Game'
											onChange={(event) =>
												setGameId(
													Number(event.target.value)
												)
											}
											sx={{
												minWidth: '300px',
												maxWidth: '300px',
											}}
										>
											{games.map((game) => (
												<MenuItem
													key={game.id}
													value={game.id}
													id={game.id.toString()}
												>
													{game.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<TextField
										id='event-max-players'
										label='Max players'
										variant='outlined'
										value={maxPlayers}
										sx={{
											minWidth: '300px',
											maxWidth: '300px',
										}}
										autoComplete='off'
										onChange={(event) => {
											const maxPlayers =
												event.target.value.trim();
											if (isNaN(Number(maxPlayers))) {
												setMaxPlayers('');
											} else {
												setMaxPlayers(maxPlayers);
											}
										}}
										inputProps={{ maxLength: 120 }}
									/>
									<TextField
										id='event-prize'
										label='Prize'
										variant='outlined'
										value={prize}
										sx={{
											minWidth: '300px',
											maxWidth: '300px',
										}}
										autoComplete='off'
										onChange={(event) => {
											const prize =
												event.target.value.trim();
											if (isNaN(Number(prize))) {
												setPrize('');
											} else {
												setPrize(prize);
											}
										}}
										inputProps={{ maxLength: 120 }}
									/>
									<LocalizationProvider
										dateAdapter={AdapterDayjs}
									>
										<DemoContainer
											components={['DatePicker']}
											sx={{
												maxWidth: '300px',
												minWidth: '300px',
												overflowX: 'hidden',
											}}
										>
											<DatePicker
												sx={{
													maxWidth: '300px',
													width: '100%',
												}}
												label='Start date'
												value={startDate}
												onChange={(date) =>
													setStartDate(dayjs(date))
												}
												slotProps={{
													textField: {
														error: false,
													},
												}}
											/>
										</DemoContainer>
									</LocalizationProvider>
									<LocalizationProvider
										dateAdapter={AdapterDayjs}
									>
										<DemoContainer
											sx={{
												maxWidth: '300px',
												minWidth: '300px',
												overflowX: 'hidden',
											}}
											components={['DatePicker']}
										>
											<DatePicker
												sx={{
													maxWidth: '300px',
													width: '100%',
												}}
												label='Finish date'
												value={endDate}
												onChange={(date) =>
													setEndDate(dayjs(date))
												}
												slotProps={{
													textField: {
														error: false,
													},
												}}
											/>
										</DemoContainer>
									</LocalizationProvider>
									<Box
										sx={{
											display: 'flex',
											gap: '6px',
											width: '600px',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Button
											type='submit'
											color='error'
											sx={{
												minWidth: '190px',
												maxWidth: '300px',
												width: '45%',
											}}
											variant='contained'
											onClick={() => setIsCreating(false)}
										>
											Cancel
										</Button>
										<Button
											type='submit'
											color='secondary'
											variant='contained'
											sx={{
												minWidth: '190px',
												maxWidth: '300px',
												width: '45%',
											}}
										>
											Submit
										</Button>
									</Box>
								</form>
							)}
						</Stack>
					</Box>
					<Box sx={{ marginTop: '24px', maxWidth: '1000px' }}>
						<Typography variant='h6'>Available events</Typography>
						{events && events.length > 0 ? (
							<TableContainer>
								<Table aria-label='a dense table' size='small'>
									<TableHead>
										<TableRow>
											<TableCell align='center'>
												ID
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '100px' }}
											>
												Name
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '100px' }}
											>
												Prize
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '100px' }}
											>
												Game
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '100px' }}
											>
												Max. players
											</TableCell>
											<TableCell align='center'>
												Start date
											</TableCell>
											<TableCell align='center'>
												End date
											</TableCell>
											<TableCell align='center'>
												Action
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{events.map((event) => (
											<TableRow
												key={event.id}
												sx={{
													'&:last-child td, &:last-child th':
														{ border: 0 },
												}}
											>
												<TableCell
													align='center'
													component='th'
													scope='row'
												>
													{event.id}
												</TableCell>
												<TableCell align='center'>
													<Typography
														sx={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
														}}
													>
														{event.name}
													</Typography>
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													U$D{' '}
													{event.prize.toLocaleString()}
												</TableCell>
												<TableCell align='center'>
													{event.game.name}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{event.max_players}
												</TableCell>
												<TableCell align='center'>
													{new Date(
														event.start_date
													).toDateString()}
												</TableCell>
												<TableCell align='center'>
													{new Date(
														event.end_date
													).toDateString()}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													<Link
														to={`/event/${event.id}`}
													>
														<Button
															size='small'
															color='secondary'
														>
															Details
														</Button>
													</Link>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Typography>
								There is no available events!
							</Typography>
						)}
					</Box>
				</>
			)}
		</PageLayout>
	);
};
