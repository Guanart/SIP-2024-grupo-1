import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../hooks';
import { PageLayout } from '../layouts/PageLayout';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { useEffect, useState } from 'react';
import { User } from '../types';
import {
	Avatar,
	Container,
	Stack,
	Typography,
	Box,
	Button,
} from '@mui/material';
import { Loader } from '../components';

export const Account = () => {
	const { accessToken } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const [userData, setUserData] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!isAuthenticated) return;

		fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/user/${user?.sub}`,
			method: 'GET',
		})
			.then((response) => {
				if (!response.ok) return;

				return response.json();
			})
			.then((data) => {
				const { user } = data;

				if (!user) return;

				setIsLoading(false);
				setUserData(user);
			});
	}, [user, isAuthenticated, accessToken]);

	return (
		<PageLayout>
			<Container>
				<Typography variant='h5' component='h2' color='primary'>
					My profile
				</Typography>
				{isLoading && <Loader />}
				{!isLoading && userData && (
					<Container sx={{ mt: '16px' }}>
						<Stack
							spacing={2}
							direction='column'
							justifyContent='start'
							alignItems='left'
						>
							<Stack spacing={2}>
								<Stack spacing={2} direction='row'>
									<Avatar
										alt={userData.username}
										src={userData.avatar}
										sx={{ width: 56, height: 56 }}
									/>
									<Box>
										<Typography variant='h6' component='h3'>
											{userData.username}
											<Typography
												variant='subtitle1'
												component='span'
												sx={{
													px: '8px',
													fontWeight: 'normal',
													color: 'grey',
												}}
											>
												{userData.email}
											</Typography>
										</Typography>
										<Typography
											variant='subtitle2'
											component='span'
											sx={{
												py: '2px',
												fontWeight: 'normal',
											}}
										>
											Argentina
										</Typography>
									</Box>
								</Stack>

								<Button
									variant='contained'
									color='secondary'
									sx={{
										maxHeight: '40px',
										minWidth: '125px',
										maxWidth: '160px',
									}}
								>
									Edit profile
								</Button>
							</Stack>
						</Stack>
					</Container>
				)}
			</Container>

			{!isLoading && (
				<>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2' color='primary'>
							Tokens
						</Typography>
						<p>
							Acá pensaba mostrar los 5 tokens más valiosos o algo
							por el estilo
						</p>
					</Container>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2' color='primary'>
							Marketplace
						</Typography>
						<p>
							Acá pensaba mostrar las últimas 5 publicaciones del
							Marketplace
						</p>
					</Container>
				</>
			)}
		</PageLayout>
	);
};
