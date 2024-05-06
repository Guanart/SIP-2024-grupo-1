import { User, useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../../layouts/PageLayout';
import { useAccessToken } from '../../hooks';
import { useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Typography, Container, Stack, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import './Home.css';

export const Home = () => {
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const theme = useTheme();

	useEffect(() => {
		// Verifica si el usuario logueado ya está dado de alta en la API. Caso contrario, envía petición para darlo de alta (es nuevo usuario)
		async function readUserStatus(user: User) {
			try {
				await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/${user.sub}`,
				});
			} catch (error) {
				const account = {
					username: user.nickname,
					email: user.email,
					auth0_id: user.sub,
					avatar: user.picture,
				};

				await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/`,
					method: 'POST',
					data: account,
				});
			}
		}

		if (!user) return;
		if (!accessToken) return;

		readUserStatus(user);
	}, [accessToken, user, isAuthenticated]);

	return (
		<PageLayout>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				className='stack-container'
			>
				<Container className='container'>
					<Typography variant='h2'>
						Unlock the power of our tokens
					</Typography>
					<Typography variant='h4' color='secondary'>
						Invest now and be part of the revolution.
					</Typography>
					<Box
						className='box-container'
						sx={{
							marginTop: '18px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						<Link to='/fundraisings'>
							<Button
								variant='contained'
								color='secondary'
								className='home-button'
								sx={{
									fontWeight: 'bold',
									paddingY: '7px',
								}}
							>
								Buy tokens
							</Button>
						</Link>
						<Link to='/about'>
							<Button
								variant='contained'
								color='primary'
								className='home-button'
								sx={{
									fontWeight: 'bold',
									border: `2px solid ${theme.palette.secondary.main}`,
									color: `${theme.palette.secondary.main}`,
								}}
							>
								Learn more
							</Button>
						</Link>
					</Box>
				</Container>
				<img
					src='/assets/images/home-deco.png'
					alt='Valorant characters'
					width='650px'
					height='650px'
				/>
			</Stack>
		</PageLayout>
	);
};
