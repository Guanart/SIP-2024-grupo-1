import { Link } from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import { Box, Stack, Typography } from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import './RequestForm.css';
import { useEffect } from 'react';

export const RequestSuccess = () => {
	useEffect(() => {
		document.title = 'Verification | LOT';
	}, []);

	return (
		<PageLayout title='requestform'>
			<Box className='requestFormBackground'>
				<Box className='form-container'>
					<Typography variant='h5'>
						Your request has been successfully created! You will
						receive a notification when the administrators process
						it.
					</Typography>

					<Link to='/' style={{ textDecoration: 'none' }}>
						<Stack direction='row' sx={{ alignItems: 'center' }}>
							<Typography
								variant='body2'
								color='secondary'
								component='span'
							>
								<KeyboardBackspaceIcon
									sx={{
										marginTop: '4px',
										marginRight: '4px',
									}}
								/>
							</Typography>
							<Typography
								variant='h6'
								color='secondary'
								component='span'
							>
								Back to home
							</Typography>
						</Stack>
					</Link>
				</Box>
			</Box>
		</PageLayout>
	);
};
