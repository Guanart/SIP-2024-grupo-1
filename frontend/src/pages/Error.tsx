import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../layouts/PageLayout';
import { Stack, Typography } from '@mui/material';
import { KeyboardBackspaceIcon } from '../global/icons';

export const Error = () => {
	const { code } = useParams();

	function getErrorMessage(code = '404') {
		if (code === '404') {
			return `Page not found`;
		} else if (code === '500') {
			return `Internal server error`;
		}
	}
	return (
		<PageLayout title={`Error ${code ?? 404}`}>
			<Typography variant='h3'>
				{getErrorMessage(code ?? '404')}
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
		</PageLayout>
	);
};
