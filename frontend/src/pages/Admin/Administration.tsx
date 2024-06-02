import { Button, Box, Stack, Typography } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks/useAccessToken';
import { PieChart, BarChart } from '@mui/x-charts';
import { Loader } from '../../components';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

type Analytics = {
	transactions: number;
	sellTransactions: number;
	buyTransactions: number;
	players: number;
	users: number;
	publications: number;
	activePublications: number;
	fundraisings: number;
	inactiveFundraisings: number;
	activeFundraisings: number;
	tokensSold: number;
	successPublications: number;
};

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
					direction={{ xs: 'column', md: 'row' }}
					sx={{
						marginTop: '32px',
						display: 'flex',
						flexWrap: 'wrap',
						gap: '62px',
					}}
				>
					<Box sx={{ maxWidth: '800px' }}>
						<Typography variant='h5' color='secondary'>
							Users
						</Typography>
						<Box sx={{ maxWidth: '800px' }}>
							<Stack direction={{ xs: 'column', md: 'row' }}>
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
										}}
									>
										{analytics.users} registered users
									</Typography>
									<Typography
										variant='h6'
										sx={{ fontWeight: 'bold' }}
										color='secondary'
									>
										{analytics.players} verified players
									</Typography>
								</Box>
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
							</Stack>
						</Box>
					</Box>
					<Box sx={{ maxWidth: '800px' }}>
						<Typography
							variant='h5'
							color='secondary'
							sx={{ marginTop: '32px' }}
						>
							Fundraisings
						</Typography>
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
									{analytics.fundraisings} fundraisings
								</Typography>
								<Typography
									sx={{ fontWeight: 'bold' }}
									variant='h6'
								>
									{analytics.activeFundraisings} active
									fundraisings
								</Typography>
								<Typography
									color='secondary'
									sx={{ fontWeight: 'bold' }}
								>
									{analytics.tokensSold} tokens sold
								</Typography>
							</Box>
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
						</Stack>
					</Box>

					<Box sx={{ maxWidth: '800px' }}>
						<Typography
							variant='h5'
							color='secondary'
							sx={{ marginTop: '32px' }}
						>
							Platform transactions
						</Typography>
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
									color='secondary'
									variant='h6'
								>
									{analytics.transactions} transactions
								</Typography>
								<Typography sx={{ fontWeight: 'bold' }}>
									{analytics.buyTransactions} buy transactions
								</Typography>
								<Typography sx={{ fontWeight: 'bold' }}>
									{analytics.sellTransactions} sell
									transactions
								</Typography>
							</Box>
							<PieChart
								series={[
									{
										data: [
											{
												id: 0,
												value: analytics.buyTransactions,
												label: 'Buy transactions',
											},
											{
												id: 1,
												value: analytics.sellTransactions,
												label: 'Sell transactions',
											},
										],
									},
								]}
								width={500}
								height={200}
							/>
						</Stack>
					</Box>

					<Box sx={{ maxWidth: '800px' }}>
						<Typography
							variant='h5'
							color='secondary'
							sx={{ marginTop: '32px' }}
						>
							Marketplace
						</Typography>
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
									{analytics.successPublications} completed
									publications
								</Typography>
							</Box>
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
						</Stack>
					</Box>
				</Stack>
			)}
		</PageLayout>
	);
};
