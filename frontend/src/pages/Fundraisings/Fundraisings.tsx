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
	Slider,
	InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Fundraising, PlayersAnalytics } from '../../types';
import { Loader } from '../../components';
import { Link } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useMediaQuery from '@mui/material/useMediaQuery';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Fundraisings = () => {
	const { accessToken, role } = useAccessToken();
	const [fundraisings, setFundraisings] = useState<Fundraising[]>([]);
	const [analytics, setAnalytics] = useState<PlayersAnalytics>();
	const [currentFundraisings, setCurrentFundraisings] = useState<
		Fundraising[]
	>([]);
	const [filter, setFilter] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [rankingCount, setRankingCount] = useState<number>(3);
	const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
	const [toDate, setToDate] = useState<Dayjs>(dayjs().add(1, 'year'));
	const { user, isAuthenticated } = useAuth0();
	const matches = useMediaQuery('(min-width:600px)');

	useEffect(() => {
		async function getFundraisings() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/fundraising`,
				});

				if (response.ok) {
					const { fundraisings } = await response.json();
					setFundraisings(fundraisings);
					setCurrentFundraisings(fundraisings);
				}

				response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/analytics/player/wins?count=${rankingCount}&from=${fromDate.toDate()}&to=${toDate.toDate()}`,
				});

				if (response.ok) {
					const data = await response.json();
					setAnalytics(data);
					console.log(data);
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getFundraisings();
	}, [accessToken, isAuthenticated, user, rankingCount, fromDate, toDate]);

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
					{analytics && (
						<Box sx={{ width: '100%', marginTop: '16px' }}>
							<Typography
								color='secondary'
								sx={{ fontWeight: 'bold', fontSize: '18px' }}
							>
								Ranking filters
							</Typography>
							<Stack
								sx={{
									minHeight: '100px',
									gap: '24px',
									marginTop: '8px',
								}}
								direction={{ xs: 'column', md: 'row' }}
							>
								<Box>
									<InputLabel id='players-wins-ranking-size'>
										Size
									</InputLabel>
									<Slider
										onChange={(_, value) => {
											setRankingCount(value as number);
										}}
										value={rankingCount}
										defaultValue={3}
										valueLabelDisplay='auto'
										step={1}
										max={10}
										min={1}
										sx={{
											minWidth: '300px',
											maxWidth: '300px',
										}}
									/>
								</Box>
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
											label='From'
											value={fromDate}
											onChange={(date) =>
												setFromDate(dayjs(date))
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
											label='To'
											value={toDate}
											onChange={(date) =>
												setToDate(dayjs(date))
											}
											slotProps={{
												textField: {
													error: false,
												},
											}}
										/>
									</DemoContainer>
								</LocalizationProvider>
							</Stack>
							<Stack
								sx={{
									marginTop: '8px',
									gap: '8px',
								}}
								direction={{ xs: 'column', lg: 'row' }}
							>
								{analytics.players.length > 0 ? (
									analytics.players.map(
										({ player }, index) => {
											return (
												<Card
													key={player.id}
													sx={{
														minWidth: '320px',
														width: '90%',
														display: 'flex',
														marginTop: '8px',
														marginBottom: '16px',
														padding: '8px',
														maxWidth: `${
															matches
																? '800px'
																: '400px'
														}`,
													}}
												>
													<CardMedia
														component='img'
														sx={{ width: 151 }}
														image={
															player.user.avatar
														}
														alt={`${player.user.username} avatar`}
													/>
													<Box
														sx={{
															display: 'flex',
															flexDirection:
																'column',
														}}
													>
														<CardContent
															sx={{
																flex: '1 0 auto',
															}}
														>
															<Typography
																gutterBottom
																variant='h5'
																component='div'
															>
																Most winning
																players
															</Typography>
															<Typography
																variant='h6'
																color='secondary'
															>
																{
																	player.user
																		.username
																}
															</Typography>
															<Typography
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{
																	analytics
																		.data[
																		index
																	]
																}
															</Typography>
														</CardContent>
														<Box
															sx={{
																display: 'flex',
																alignItems:
																	'center',
																pl: 1,
																pb: 1,
															}}
														>
															<Button
																size='small'
																color='secondary'
																onClick={() => {
																	setFilter(
																		player
																			.user
																			.username ??
																			''
																	);
																}}
															>
																Search his/her
																tokens
															</Button>
														</Box>
													</Box>
												</Card>
											);
										}
									)
								) : (
									<Typography sx={{ fontWeight: 'bold' }}>
										No players match the filter
									</Typography>
								)}
							</Stack>
						</Box>
					)}
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
