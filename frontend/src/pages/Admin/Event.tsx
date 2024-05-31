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
import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Loader } from '../../components';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event as EventType, Player } from '../../types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { range } from '../../utils/range';

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
	const [isPositioning, setIsPositioning] = useState<boolean>(false);
	const [currentPlayer, setCurrentPlayer] = useState<Player>();
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();

	const isMediumScreen = useMediaQuery('(min-width: 600px)'); // Definir el breakpoint en 600px

	const getEvent = useCallback(async () => {
		try {
			let response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/event/details/${event_id}`,
			});

			if (response.ok) {
				const data = await response.json();

				setEvent(data.event);

				console.log(data.event.active);

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
	}, [accessToken, event_id, isAuthenticated]);

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
			getEvent();
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

	async function handleSetPosition(position: number) {
		try {
			if (!currentPlayer) return;

			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/event/position`,
				method: 'POST',
				data: {
					event_id: event?.id,
					player_id: currentPlayer.id,
					position: position,
				},
			});

			if (position === 0)
				toast.success(
					`Position for player ${currentPlayer.id} unsetted`
				);
			else {
				toast.success(
					`Position for player ${currentPlayer.id} updated`
				);
			}

			setIsPositioning(false);
			setIsLoading(true);
			getEvent();
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

	async function handleDeletePlayer(player_id: number) {
		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/event/unregister`,
				method: 'DELETE',
				data: {
					player_id,
					event_id: Number(event?.id),
				},
			});

			toast.success(`Player successfully unregistered from the event`);

			setIsLoading(true);
			getEvent();
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

	function handleSetPositionClick(player: Player) {
		setCurrentPlayer(player);

		if (isPositioning && currentPlayer?.id === player.id) {
			setIsPositioning(false);
		} else {
			setIsPositioning(true);
		}
	}

	useEffect(() => {
		if (!user) return;
		if (!accessToken) return;

		getEvent();
	}, [accessToken, isAuthenticated, user, event_id, getEvent]);

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
			{!isLoading && event && (
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
						</Box>
					</Box>
					<Stack direction='column' spacing={2} width='80%'>
						{isPositioning && (
							<Stack direction='column'>
								<Typography
									color='secondary'
									sx={{ fontWeight: 'bold' }}
								>
									<Typography
										component='span'
										color='white'
										sx={{
											marginRight: '6px',
											fontWeight: 'bold',
										}}
									>
										Updating position for player
									</Typography>
									{currentPlayer?.user.username} (ID{' '}
									{currentPlayer?.id})
								</Typography>
								<Typography>
									Select the final position of the player on
									the event
								</Typography>
								<Box sx={{ display: 'flex', marginTop: '8px' }}>
									<Button
										key={0}
										size='small'
										color='secondary'
										sx={{
											maxWidth: '10px',
											fontWeight: 'bold',
											fontSize: '16px',
										}}
										onClick={() => handleSetPosition(0)}
									>
										-
									</Button>
									{range(1, event.max_players + 1, 1).map(
										(value) => {
											return (
												<Button
													key={value}
													size='small'
													color='secondary'
													sx={{
														maxWidth: '10px',
														fontWeight: 'bold',
														fontSize: '16px',
													}}
													onClick={() =>
														handleSetPosition(value)
													}
												>
													{value}
												</Button>
											);
										}
									)}
								</Box>
							</Stack>
						)}
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
								<InputLabel id='player-info'>Player</InputLabel>
								<Select
									labelId='player-info'
									id='player-event'
									label='Event'
									onChange={(event) =>
										setPlayerId(Number(event.target.value))
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
														alignItems: 'center',
														gap: '8px',
													}}
												>
													<Avatar
														src={player.user.avatar}
													/>
													<Typography>
														{player.user.username}
													</Typography>
												</Box>
											</MenuItem>
										))
									) : (
										<MenuItem>There is no players</MenuItem>
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
									height: isMediumScreen ? '56px' : 'auto',
									minWidth: isMediumScreen
										? '120px'
										: '300px',
								}}
							>
								Register player
							</Button>
						</form>
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
										<TableCell align='center'>
											Action
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
													<TableCell align='center'>
														{position === 0
															? '-'
															: position}
													</TableCell>
													<TableCell
														align='center'
														sx={{
															fontWeight: 'bold',
															display: 'flex',
															flexDirection:
																'column',
															alignItems:
																'center',
															justifyContent:
																'center',
														}}
													>
														<Button
															disabled={
																event.active
															}
															color={
																currentPlayer?.id ===
																	player.id &&
																isPositioning
																	? 'error'
																	: 'secondary'
															}
															size='small'
															sx={{
																marginTop:
																	'8px',
																maxWidth:
																	'150px',
															}}
															onClick={() => {
																handleSetPositionClick(
																	player
																);
															}}
														>
															{currentPlayer?.id ===
																player.id &&
															isPositioning
																? 'Cancel'
																: 'Set position'}
														</Button>
														<Button
															color='error'
															sx={{
																marginTop:
																	'8px',
																maxWidth:
																	'150px',
															}}
															onClick={() =>
																handleDeletePlayer(
																	player.id
																)
															}
														>
															Delete
														</Button>
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
