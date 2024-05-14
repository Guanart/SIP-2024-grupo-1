import { Link} from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import { Box, Stack, Typography } from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import './RequestForm.css';

export const RequestSuccess = () => {
	return (
		<PageLayout title='requestform'>
			<Box className='requestFormBackground'>
				<Box className='form-container'>
					<Typography variant='h5'>
						Su solicitud ha sido creada con exito! Nuestros administradores la revisaran en la brevedad.
					</Typography>

					<Link to='/' style={{ textDecoration: 'none' }}>
						<Stack direction='row' sx={{ alignItems: 'center' }}>
							<Typography
								variant='body2'
								color='secondary'
								component='span'
							>
								<KeyboardBackspaceIcon
									sx={{ marginTop: '4px', marginRight: '4px' }}
								/>
							</Typography>
							<Typography variant='h6' color='secondary' component='span'>
								Back to home
							</Typography>
						</Stack>
					</Link>
				</Box>
			</Box>
		</PageLayout>
	);
};