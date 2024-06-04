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
} from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks/useAccessToken';
import { PieChart, BarChart } from '@mui/x-charts';
import { Loader } from '../../components';
import { Analytics, PlayerAnalytic } from '../../types';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Administration = () => {
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();
	const [analytics, setAnalytics] = useState<Analytics>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		async function getAnalytics() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/admin`,
				});

				if (response.ok) {
					const { data } = await response.json();

					if (data) {
						setAnalytics(data);
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
					<Box sx={{ maxWidth: '1200px' }}>
						<Typography variant='h5' color='secondary'>
							Transactions
						</Typography>
						<Box>
							<Typography variant='h6' color='error'>
								Agregar acá filtro de fechas
							</Typography>
						</Box>
						<Stack
							direction={{ xs: 'column', md: 'row' }}
							spacing={6}
						>
							<TableContainer
								sx={{
									paddingTop: '16px',
									maxWidth: '600px',
								}}
							>
								<Table aria-label='a dense table' size='small'>
									<TableHead>
										<TableRow>
											<TableCell align='center'>
												Total
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '80px' }}
											>
												BUY
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '80px' }}
											>
												SELL
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
												1000
											</TableCell>
											<TableCell
												align='center'
												sx={{
													fontWeight: 'bold',
												}}
											>
												500
											</TableCell>
											<TableCell
												align='center'
												sx={{
													fontWeight: 'bold',
												}}
											>
												500
											</TableCell>
											<TableCell
												align='center'
												sx={{
													fontWeight: 'bold',
												}}
											>
												U$D 100.000
											</TableCell>
										</TableRow>
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
									sx={{ fontWeight: 'bold' }}
									color='secondary'
									variant='h6'
								>
									{analytics.transactions} transactions
								</Typography>
								<Typography
									sx={{ fontWeight: 'bold' }}
									color='error'
									variant='h6'
								>
									Acá mostrar un gráfico adecuado a los datos
									de transacciones
								</Typography>
							</Box>
						</Stack>
					</Box>
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
															label: 'Completed fundraisings',
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
													sx={{
														fontWeight: 'bold',
													}}
												>
													1
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													League of Legends
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													U$D 1.000.000
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							</Stack>
						</Box>
					</Box>

					<Box sx={{ maxWidth: '1200px' }}>
						<Box>
							<Typography variant='h5' color='secondary'>
								Marketplace
							</Typography>
							<Stack
								direction={{ xs: 'column', md: 'row' }}
								spacing={6}
							>
								<TableContainer
									sx={{
										paddingTop: '16px',
										maxWidth: '600px',
									}}
								>
									<Table
										aria-label='a dense table'
										size='small'
									>
										<TableHead>
											<TableRow>
												<TableCell align='center'>
													Publications
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
													Active publications
												</TableCell>
												<TableCell
													align='center'
													sx={{ maxWidth: '80px' }}
												>
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
													{
														analytics.activePublications
													}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{
														analytics.successPublications
													}
												</TableCell>
											</TableRow>
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
										sx={{ fontWeight: 'bold' }}
										color='secondary'
										variant='h6'
									>
										{analytics.publications} publications
									</Typography>
									<Typography sx={{ fontWeight: 'bold' }}>
										{analytics.activePublications} active
										publications
									</Typography>
									<Typography sx={{ fontWeight: 'bold' }}>
										{analytics.successPublications}{' '}
										completed publications
									</Typography>
									<PieChart
										series={[
											{
												data: [
													{
														id: 0,
														value: analytics.successPublications,
														label: 'Tokens sold',
													},
													{
														id: 1,
														value: analytics.activePublications,
														label: 'Active publications',
													},
												],
											},
										]}
										width={500}
										height={200}
									/>
								</Box>
							</Stack>
						</Box>
					</Box>
				</Stack>
			)}
		</PageLayout>
	);
};
