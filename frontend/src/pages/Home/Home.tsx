import { User, useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../../layouts/PageLayout';
import { useAccessToken } from '../../hooks';
import { useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Typography, Container, Stack, Box, Button } from '@mui/material';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import './Home.css';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

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
					url: `${HOST}:${PORT}/user/${user.sub}`,
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
					url: `${HOST}:${PORT}/user/`,
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
		<PageLayout title='Home'>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				className='stack-container'
				sx={{
					height: '100vh', // Make sure the stack takes the full viewport height
					width: '100vw',
					justifyContent: 'center',
				}}
			>
				<Container
					className='container'
					sx={{
						backgroundImage: 'url(/assets/images/home-deco1.png)', // Your background image
						//backgroundSize: 'cover',
						padding: '2rem',
						width: '100vw',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<Box
						sx={{
							textAlign: 'left',
							maxWidth: '60%', // Adjust this value to control the width of the text content
						}}
					>
						<Typography
							variant='h2'
							fontFamily='Orbitron, sans-serif'
						>
							Unlock the power of our tokens
						</Typography>
						<Typography
							variant='h4'
							color='secondary'
							sx={{ mt: 2 }}
							fontFamily='Bebas Neue, sans-serif'
						>
							Invest now and be part of the revolution
						</Typography>
						<Box
							className='box-container'
							sx={{
								marginTop: '18px',
								display: 'flex',
								justifyContent: 'flex-start', // Align items to the start (left)
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
							<Link to='/help'>
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
					</Box>
				</Container>
			</Stack>
		</PageLayout>
	);
	/*
	<img
	src='/assets/images/home-deco.png'
	alt='Valorant characters'
	width='650px'
	height='650px'
/>
*/
};
