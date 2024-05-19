import { Button, Box, Stack, Typography } from '@mui/material';
import { PageLayout } from '../layouts/PageLayout';
import { Link } from 'react-router-dom';

export const Administration = () => {
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
			<Box sx={{ marginTop: '18px' }}>
				<Typography variant='h6'>¿Estadisticas?</Typography>
				<p>
					Lorem ipsum, dolor sit amet consectetur adipisicing elit.
					Dolorem nobis aut aliquam corrupti eveniet voluptatum odit
					minus alias neque natus ab, id iure debitis! Nulla pariatur
					inventore nihil nisi impedit.
				</p>
			</Box>
		</PageLayout>
	);
};
