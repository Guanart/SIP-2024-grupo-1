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
	const [account, setAccount] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!isAuthenticated) return;

		fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/account/${user?.sub}`,
			method: 'GET',
		})
			.then((response) => {
				if (!response.ok) return;

				return response.json();
			})
			.then((data) => {
				const { account } = data;

				if (!account) return;

				setIsLoading(false);
				setAccount(account);
			});
	}, [user, isAuthenticated, accessToken]);

	return (
		<PageLayout>
			<Container>
				<Typography variant='h5' component='h2' color='primary'>
					My profile
				</Typography>
				{isLoading && <Loader />}
				{!isLoading && account && (
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
										alt={account.username}
										src={account.avatar}
										sx={{ width: 56, height: 56 }}
									/>
									<Box>
										<Typography variant='h6' component='h3'>
											{account.username}
											<Typography
												variant='subtitle1'
												component='span'
												sx={{
													px: '8px',
													fontWeight: 'normal',
													color: 'grey',
												}}
											>
												{account.email}
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

								<Typography
									maxWidth='750px'
									variant='body1'
									component='p'
								>
									Lorem Ipsum es simplemente el texto de
									relleno de las imprentas y archivos de
									texto. Lorem Ipsum ha sido el texto de
									relleno estándar de las industrias desde el
									año 1500, cuando un impresor. 200 Chars
								</Typography>
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

			<Container sx={{ mt: '24px' }}>
				<Typography variant='h6' component='h2' color='primary'>
					Tokens
				</Typography>
			</Container>
			<Container sx={{ mt: '24px' }}>
				<Typography variant='h6' component='h2' color='primary'>
					Marketplace
				</Typography>
			</Container>
		</PageLayout>
	);
};
