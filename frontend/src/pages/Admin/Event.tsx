import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import {
	Button,
	Stack,
	Typography,
	Box,
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableBody,
	TextField,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Avatar,
	useMediaQuery,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Loader } from '../../components';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event as EventType, Player } from '../../types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

function dateAsString(date?: Date) {
	return dayjs(date).format('LL');
}

export const Event = () => {
	const { event_id } = useParams();
	const [event, setEvent] = useState<EventType>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [players, setPlayers] = useState<Player[]>([]);
	const [playerId, setPlayerId] = useState<string | number>('');
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();

	const isMediumScreen = useMediaQuery('(min-width: 600px)'); // Definir el breakpoint en 600px

	useEffect(() => {
		async function getEvent() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/event/details/${event_id}`,
				});

				if (response.ok) {
					const data = await response.json();

					setEvent(data.event);

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://${HOST}:${PORT}/player/game/${data.event.game.id}`,
					});

					if (response.ok) {
						const { players } = await response.json();
						setPlayers(players);
						setIsLoading(false);
					}
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvent();
	}, [accessToken, isAuthenticated, user, event_id, isAdding]);

	async function handleAddPlayer() {
		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/event/register`,
				method: 'POST',
				data: { event_id: event?.id, player_id: playerId },
			});

			toast.success('Player registered successfully');

			setIsLoading(true);
			setTimeout(() => navigate(0), 2000);
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
		<PageLayout title={`Event`}>
			<Link to={`/events`}>
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
					sx={{ marginTop: '8px' }}
					direction={{ xs: 'column', md: 'row' }}
					spacing={8}
				>
					<Box>
						<Typography variant='h6'>Event details</Typography>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
								marginTop: '6px',
							}}
						>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Event ID
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{event?.id}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Name
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{event?.name}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Game
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{event?.game.name}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Start date
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{dateAsString(event?.start_date)}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									End date
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{dateAsString(event?.end_date)}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Max. players
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									{event?.max_players}
								</Typography>
							</Box>
							<Box>
								<Typography
									color='secondary'
									component='span'
									sx={{ fontWeight: 'bold' }}
								>
									Prize
								</Typography>
								<Typography
									component='span'
									sx={{ marginLeft: '8px' }}
								>
									U$D {event?.prize.toLocaleString()}
								</Typography>
							</Box>
							<Button
								variant='contained'
								color={!isAdding ? 'secondary' : 'error'}
								sx={{ marginTop: '8px', maxWidth: '150px' }}
								onClick={() => setIsAdding(!isAdding)}
							>
								{!isAdding ? 'Add player' : 'Cancel'}
							</Button>
						</Box>
					</Box>
					<Stack direction='column' spacing={2} width='80%'>
						{/* TODO: Hacer responsive el form. En mobile direction column probablemente */}
						{isAdding && (
							<form
								style={{
									display: 'flex',
									gap: '6px',
									alignItems: isMediumScreen
										? 'center'
										: 'flex-start',
									flexDirection: isMediumScreen
										? 'row'
										: 'column',
								}}
							>
								<TextField
									label='Game'
									variant='outlined'
									disabled
									value={event?.game.name}
									sx={{
										minWidth: isMediumScreen
											? '200px'
											: '300px',
										maxWidth: isMediumScreen
											? '200px'
											: '300px',
										width: '95%',
									}}
									inputProps={{ maxLength: 120 }}
								/>
								<FormControl
									sx={{
										minWidth: '300px',
										maxWidth: '350px',
										width: '90%',
									}}
								>
									<InputLabel id='player-info'>
										Player
									</InputLabel>
									<Select
										labelId='player-info'
										id='player-event'
										label='Event'
										onChange={(event) =>
											setPlayerId(
												Number(event.target.value)
											)
										}
										value={playerId}
										sx={{
											width: '100%',
											maxHeight: '56px',
										}}
									>
										{players.length > 0 ? (
											players.map((player) => (
												<MenuItem
													key={player.id}
													value={player.id}
													id={player.id.toString()}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems:
																'center',
															gap: '8px',
														}}
													>
														<Avatar
															src={
																player.user
																	.avatar
															}
														/>
														<Typography>
															{
																player.user
																	.username
															}
														</Typography>
													</Box>
												</MenuItem>
											))
										) : (
											<MenuItem>
												There is no players
											</MenuItem>
										)}
									</Select>
								</FormControl>
								<Button
									type='submit'
									variant='contained'
									color='secondary'
									onClick={(e) => {
										e.preventDefault();
										handleAddPlayer();
									}}
									disabled={!playerId}
									sx={{
										height: isMediumScreen
											? '56px'
											: 'auto',
										minWidth: isMediumScreen
											? '120px'
											: '300px',
									}}
								>
									Submit
								</Button>
							</form>
						)}
						<TableContainer sx={{ maxWidth: '900px' }}>
							<Table aria-label='a dense table' size='small'>
								<TableHead>
									<TableRow>
										<TableCell align='center'>
											Player ID
										</TableCell>
										<TableCell align='center'>
											Name
										</TableCell>
										<TableCell align='center'>
											Ranking
										</TableCell>
										<TableCell align='center'>
											Position
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{event?.player_event.map(
										({ player, position }) => {
											return (
												<TableRow
													key={player.id}
													sx={{
														'&:last-child td, &:last-child th':
															{
																border: 0,
															},
													}}
												>
													<TableCell
														align='center'
														component='th'
														scope='row'
													>
														{player.id}
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
															{
																player.user
																	.username
															}
														</Typography>
													</TableCell>
													<TableCell
														align='center'
														sx={{
															fontWeight: 'bold',
														}}
													>
														{
															player.rank
																.description
														}
													</TableCell>
													<TableCell
														align='center'
														sx={{
															fontWeight: 'bold',
														}}
													>
														{position === 0 ? (
															<Button
																disabled={
																	dayjs().format(
																		'LL'
																	) <
																	dayjs(
																		event.end_date
																	).format(
																		'LL'
																	)
																}
																color='secondary'
																size='small'
																sx={{
																	marginTop:
																		'8px',
																	maxWidth:
																		'150px',
																}}
															>
																Set position
															</Button>
														) : (
															position
														)}
													</TableCell>
												</TableRow>
											);
										}
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Stack>
				</Stack>
			)}
		</PageLayout>
	);
};
