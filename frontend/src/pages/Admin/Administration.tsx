import {
	Button,
	Box,
	Stack,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Slider,
	Divider,
	InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks/useAccessToken';
import { PieChart, BarChart, SparkLineChart } from '@mui/x-charts';
import { Loader } from '../../components';
import {
	Analytics,
	PlayerAnalytic,
	GameAnalytics,
	EarningsAnalytics,
} from '../../types';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Administration = () => {
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();
	const [analytics, setAnalytics] = useState<Analytics>();
	const [gameAnalytics, setGameAnalytics] = useState<GameAnalytics[]>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [fundraisingsCount, setFundraisingsCount] = useState<number>(0);
	const [minPercentageLimit, setMinPercentageLimit] = useState<number>(0);
	const [maxPercentageLimit, setMaxPercentageLimit] = useState<number>(100);
	const [earningsFromTransactions, setEarningsFromTransactions] =
		useState<EarningsAnalytics>();
	const [fromDate, setFromDate] = useState<Dayjs>(dayjs());
	const [toDate, setToDate] = useState<Dayjs>(dayjs().add(1, 'year'));

	useEffect(() => {
		async function getAnalytics() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/admin`,
				});

				if (response.ok) {
					const { data } = await response.json();

					if (!data) return;

					setAnalytics(data);

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/analytics/games/popular`,
					});

					if (response.ok) {
						const { games } = await response.json();
						setGameAnalytics(games.game);
						setIsLoading(false);
					}
				}
			} catch (error) {
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getAnalytics();
	}, [accessToken, isAuthenticated, user, navigate]);

	useEffect(() => {
		async function getAnalytics() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/analytics/fundraisings/percentage/${minPercentageLimit}/${maxPercentageLimit}`,
				});

				if (response.ok) {
					const { count } = await response.json();
					setFundraisingsCount(count);
				}
			} catch (error) {
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getAnalytics();
	}, [
		accessToken,
		isAuthenticated,
		user,
		navigate,
		maxPercentageLimit,
		minPercentageLimit,
	]);

	useEffect(() => {
		async function getAnalytics() {
			try {
				if (toDate < fromDate) return;

				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/admin`,
				});

				if (response.ok) {
					const { data } = await response.json();

					if (data) {
						setAnalytics(data);
					}

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/analytics/earnings?from=${fromDate}&to=${toDate}`,
					});

					if (response.ok) {
						const { earnings } = await response.json();
						setEarningsFromTransactions(earnings);
					}
				}
			} catch (error) {
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getAnalytics();
	}, [accessToken, isAuthenticated, user, navigate, fromDate, toDate]);

	return (
		<PageLayout title='Administration panel'>
			<Stack
				spacing={1}
				direction={{ xs: 'column', md: 'row' }}
				sx={{ marginTop: '12px' }}
			>
				<Link to='/requests'>
					<Button
						variant='contained'
						color='secondary'
						sx={{ minWidth: '200px' }}
					>
						Verification requests
					</Button>
				</Link>
				<Link to='/events'>
					<Button
						variant='contained'
						color='secondary'
						sx={{ minWidth: '200px' }}
					>
						Events
					</Button>
				</Link>
				<Link to='/games'>
					<Button
						variant='contained'
						color='secondary'
						sx={{ minWidth: '200px' }}
					>
						Games
					</Button>
				</Link>
			</Stack>
			{isLoading && <Loader />}
			{!isLoading && analytics && (
				<Stack
					direction={{ xs: 'column' }}
					sx={{
						marginTop: '32px',
						display: 'flex',
						gap: '62px',
					}}
				>
					{earningsFromTransactions && (
						<Box sx={{ maxWidth: '1400px' }}>
							<Typography variant='h5' color='secondary'>
								Transactions
							</Typography>

							<Stack
								direction={{ xs: 'column', lg: 'row' }}
								spacing={6}
							>
								<TableContainer
									sx={{
										paddingTop: '16px',
										maxWidth: '600px',
										minWidth: '500px',
									}}
								>
									<Stack
										sx={{
											marginTop: '8px',
										}}
										direction={{ xd: 'column', md: 'row' }}
										spacing={1}
									>
										<LocalizationProvider
											dateAdapter={AdapterDayjs}
										>
											<DemoContainer
												components={['DatePicker']}
												sx={{
													maxWidth: '240px',
													minWidth: '240px',
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
													onChange={(date) => {
														if (!date) return;
														if (date > toDate) {
															setFromDate(
																dayjs(toDate)
															);
														} else {
															setFromDate(
																dayjs(date)
															);
														}
													}}
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
													maxWidth: '240px',
													minWidth: '240px',
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
													onChange={(date) => {
														if (!date) return;

														if (date < fromDate) {
															setToDate(
																dayjs(fromDate)
															);
														} else {
															setToDate(
																dayjs(date)
															);
														}
													}}
													slotProps={{
														textField: {
															error: false,
														},
													}}
												/>
											</DemoContainer>
										</LocalizationProvider>
									</Stack>
									<Table
										aria-label='a dense table'
										size='small'
										sx={{
											maxWidth: '500px',
											marginTop: '16px',
										}}
									>
										<TableHead>
											<TableRow>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													From
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													To
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Total
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Earnings
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow
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
													{fromDate
														.toString()
														.slice(0, 16)}
												</TableCell>
												<TableCell
													align='center'
													component='th'
													scope='row'
												>
													{fromDate
														.toString()
														.slice(0, 16)}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{
														earningsFromTransactions?.transactions
													}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													U$D{' '}
													{earningsFromTransactions?.earnings.toLocaleString()}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										padding: '24px',
										border: '2px solid gray',
										borderRadius: '8px',
										maxWidth: '700px',
									}}
								>
									<Typography
										sx={{
											fontSize: '14px',
											fontWeight: 'bold',
										}}
										color='secondary'
									>
										Last week earnings from transactions
									</Typography>

									<SparkLineChart
										data={earningsFromTransactions.transactionsByDay.map(
											({ earnings }) => earnings
										)}
										xAxis={{
											scaleType: 'time',
											data: earningsFromTransactions.transactionsByDay.map(
												({ date }) => new Date(date)
											),
											valueFormatter: (value) =>
												value
													.toISOString()
													.slice(0, 10),
										}}
										valueFormatter={(
											value: number | null
										) => `U$D ${value?.toLocaleString()}`}
										height={250}
										width={600}
										showTooltip
										colors={['#02B2AF']}
										showHighlight
									/>
								</Box>
							</Stack>
						</Box>
					)}
					<Divider />
					<Box sx={{ maxWidth: '1200px' }}>
						<Box>
							<Typography variant='h5' color='secondary'>
								Players
							</Typography>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={6}
							>
								<TableContainer
									sx={{
										paddingTop: '16px',
										maxWidth: '600px',
										minWidth: '400px',
									}}
								>
									<Table
										aria-label='a dense table'
										size='small'
									>
										<TableHead>
											<TableRow>
												<TableCell align='center'>
													Description
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Player
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Data
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{analytics.playersAnalytics.map(
												(analytic: PlayerAnalytic) => {
													return (
														<TableRow
															sx={{
																'&:last-child td, &:last-child th':
																	{
																		border: 0,
																	},
															}}
															key={
																analytic.description
															}
														>
															<TableCell
																align='center'
																component='th'
																scope='row'
															>
																{
																	analytic.description
																}
															</TableCell>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{
																	analytic
																		.player
																		.user
																		.username
																}
															</TableCell>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{analytic.data}
															</TableCell>
														</TableRow>
													);
												}
											)}
										</TableBody>
									</Table>
								</TableContainer>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										marginTop: '8px',
									}}
								>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 'bold',
											marginLeft: '16px',
										}}
									>
										{analytics.users} registered users
									</Typography>
									<Typography
										variant='h6'
										sx={{
											fontWeight: 'bold',
											marginLeft: '16px',
										}}
										color='secondary'
									>
										{analytics.players} verified players
									</Typography>
									<BarChart
										xAxis={[
											{
												scaleType: 'band',
												data: ['Users', 'Players'],
											},
										]}
										series={[
											{
												data: [
													analytics.users,
													analytics.players,
												],
											},
										]}
										width={500}
										height={300}
									/>
								</Box>
							</Stack>
						</Box>
					</Box>
					<Divider />
					<Box sx={{ maxWidth: '1200px' }}>
						<Box>
							<Typography variant='h5' color='secondary'>
								Fundraisings
							</Typography>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={6}
							>
								<TableContainer
									sx={{
										paddingTop: '16px',
										maxWidth: '600px',
										minWidth: '400px',
									}}
								>
									<Table
										aria-label='a dense table'
										size='small'
									>
										<TableHead>
											<TableRow>
												<TableCell align='center'>
													Total
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Active
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Tokens sold
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											<TableRow
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
													{analytics.fundraisings}
												</TableCell>

												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{
														analytics.activeFundraisings
													}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{analytics.tokensSold}{' '}
													tokens
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
									<Typography
										sx={{
											fontWeight: 'bold',
											marginTop: '24px',
										}}
										variant='h6'
									>
										Average token price
										<Typography
											component='span'
											color='secondary'
											variant='h6'
											sx={{
												fontWeight: 'bold',
												marginLeft: '8px',
											}}
										>
											U$D {analytics.averageTokenPrice}
										</Typography>
									</Typography>
									<Box>
										<Stack
											direction={{
												xs: 'column',
												md: 'row',
											}}
											spacing={{ xs: 2, md: 4 }}
											sx={{
												minWidth: '200px',
												maxWidth: '200px',
												marginLeft: '8px',
												marginTop: '24px',
											}}
										>
											<Box>
												<InputLabel id='player-info'>
													Min. % of the goal amount
												</InputLabel>
												<Slider
													onChange={(_, value) => {
														if (
															(value as number) <
															maxPercentageLimit
														) {
															setMinPercentageLimit(
																value as number
															);
														}
													}}
													value={minPercentageLimit}
													defaultValue={0.0}
													aria-label='Small'
													size='small'
													valueLabelDisplay='auto'
													step={10}
													max={90}
													min={0}
												/>
											</Box>
											<Box>
												<InputLabel id='player-info'>
													Max. % of the goal amount
												</InputLabel>
												<Slider
													onChange={(_, value) => {
														if (
															(value as number) >
															minPercentageLimit
														) {
															setMaxPercentageLimit(
																value as number
															);
														}
													}}
													value={maxPercentageLimit}
													defaultValue={100}
													aria-label='Small'
													size='small'
													valueLabelDisplay='auto'
													step={10}
													min={10}
													max={100}
												/>
											</Box>
										</Stack>
										<Typography
											sx={{
												fontWeight: 'bold',
												fontSize: '18px',
											}}
										>
											Reach between {minPercentageLimit}%
											and {maxPercentageLimit}% of the
											goal amount
										</Typography>
										<Typography
											color='secondary'
											variant='h6'
											sx={{
												fontWeight: 'bold',
											}}
										>
											{(fundraisingsCount /
												analytics.fundraisings) *
												100}{' '}
											% of total =
											<Typography
												variant='h6'
												component='span'
												sx={{
													fontWeight: 'bold',
													marginLeft: '8px',
												}}
											>
												{fundraisingsCount} fundraisings{' '}
											</Typography>
										</Typography>
									</Box>
								</TableContainer>
								<Stack direction={{ xs: 'column', md: 'row' }}>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											marginTop: '8px',
										}}
									>
										<Typography
											sx={{ fontWeight: 'bold' }}
											variant='h6'
										>
											{analytics.fundraisings}{' '}
											fundraisings
										</Typography>
										<Typography
											sx={{ fontWeight: 'bold' }}
											variant='h6'
										>
											{analytics.activeFundraisings}{' '}
											active fundraisings
										</Typography>
										<Typography
											color='secondary'
											sx={{ fontWeight: 'bold' }}
										>
											{analytics.tokensSold} tokens sold
										</Typography>
										<PieChart
											series={[
												{
													data: [
														{
															id: 0,
															value: analytics.inactiveFundraisings,
															label: 'Previous fundraisings',
														},
														{
															id: 1,
															value: analytics.activeFundraisings,
															label: 'Active fundraisings',
														},
													],
												},
											]}
											width={600}
											height={200}
										/>
									</Box>
								</Stack>
							</Stack>
						</Box>
					</Box>
					<Divider />
					<Box sx={{ maxWidth: '1200px' }}>
						<Box>
							<Typography variant='h5' color='secondary'>
								Games
							</Typography>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={6}
							>
								<TableContainer
									sx={{
										paddingTop: '16px',
										maxWidth: '600px',
										minWidth: '400px',
									}}
								>
									<Typography variant='h6'>
										Game whose events raised the most money
									</Typography>
									<Table
										aria-label='a dense table'
										size='small'
									>
										<TableHead>
											<TableRow>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													#
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Game
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Amount
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Events
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{gameAnalytics?.map(
												(
													{ game, total, events },
													index
												) => {
													return (
														<TableRow
															key={game}
															sx={{
																'&:last-child td, &:last-child th':
																	{
																		border: 0,
																	},
															}}
														>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{index + 1}
															</TableCell>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{game}
															</TableCell>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																U$D{' '}
																{total.toLocaleString()}
															</TableCell>
															<TableCell
																align='center'
																sx={{
																	fontWeight:
																		'bold',
																}}
															>
																{events}
															</TableCell>
														</TableRow>
													);
												}
											)}
										</TableBody>
									</Table>
								</TableContainer>
							</Stack>
						</Box>
					</Box>
					<Divider />
					<Box sx={{ maxWidth: '1200px' }}>
						<Box>
							<Typography variant='h5' color='secondary'>
								Marketplace
							</Typography>
							<TableContainer
								sx={{
									paddingTop: '16px',
									maxWidth: '600px',
									minWidth: '400px',
								}}
							>
								<Table aria-label='a dense table' size='small'>
									<TableHead>
										<TableRow>
											<TableCell align='center'>
												Publications
											</TableCell>
											<TableCell align='center'>
												Active publications
											</TableCell>
											<TableCell align='center'>
												Completed publications
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										<TableRow
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
												{analytics.publications}
											</TableCell>

											<TableCell
												align='center'
												sx={{
													fontWeight: 'bold',
												}}
											>
												{analytics.activePublications}
											</TableCell>
											<TableCell
												align='center'
												sx={{
													fontWeight: 'bold',
												}}
											>
												{analytics.successPublications}
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>
					</Box>
				</Stack>
			)}
		</PageLayout>
	);
};
