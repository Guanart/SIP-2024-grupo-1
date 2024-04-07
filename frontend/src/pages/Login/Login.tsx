import { SignupButton, LoginButton } from '../../components';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import './Login.css';

export const Login = () => {
	const isMediumScreen = useMediaQuery('(min-width: 600px)'); // Definir el breakpoint en 600px

	return (
		<Box height='100vh' width='100%' component='section' className='hero'>
			<Box
				height='100vh'
				width='100%'
				component='section'
				className='hero-cover'
			>
				<Box
					height='100%'
					width='100%'
					m='auto'
					maxWidth='700px'
					display='flex'
					flexDirection='column'
					alignItems='center'
					justifyContent='center'
					gap={3}
					p={2}
					component='section'
				>
					<Typography
						variant={isMediumScreen ? 'h2' : 'h3'}
						component='h2'
						color='secondary'
						fontWeight={500}
						textAlign='center'
						fontFamily='Orbitron, sans-serif'
						px={2}
					>
						LEAGUE OF TOKEN
					</Typography>
					<Typography
						variant={isMediumScreen ? 'h3' : 'h4'}
						component='h3'
						color='white'
						fontWeight={400}
						textAlign='center'
						fontFamily='Orbitron, sans-serif'
						px={2}
					>
						MAKE YOUR DREAM REAL
					</Typography>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
						<LoginButton />
						<SignupButton />
					</Stack>
				</Box>
			</Box>
		</Box>
	);
};
