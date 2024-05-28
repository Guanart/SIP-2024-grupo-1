import { Link, useParams } from 'react-router-dom';
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
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Loader } from '../../components';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Event as EventType } from '../../types';
import dayjs from 'dayjs';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

function dateAsString(date?: Date) {
	return dayjs(date).format('LL');
}

export const Event = () => {
	const { event_id } = useParams();
	const [event, setEvent] = useState<EventType>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();

	useEffect(() => {
		async function getEvent() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/event/details/${event_id}`,
				});

				if (response.ok) {
					const { event } = await response.json();

					setEvent(event);
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvent();
	}, [accessToken, isAuthenticated, user, event_id]);

	return (
		<PageLayout title={`${event?.name}`}>
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
									{event?.prize}
								</Typography>
							</Box>
							<Button
								variant='contained'
								color='secondary'
								sx={{ marginTop: '8px', maxWidth: '150px' }}
							>
								Add player
							</Button>
						</Box>
					</Box>
					<TableContainer sx={{ maxWidth: '900px' }}>
						<Table aria-label='a dense table' size='small'>
							<TableHead>
								<TableRow>
									<TableCell align='center'>
										Player ID
									</TableCell>
									<TableCell align='center'>Name</TableCell>
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
														{player.user.username}
													</Typography>
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{player.rank.description}
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
																) !==
																dayjs(
																	event.end_date
																).format('LL')
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
			)}
		</PageLayout>
	);
};
