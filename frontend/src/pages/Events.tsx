import { Button } from '@mui/material';
import { PageLayout } from '../layouts/PageLayout';
import { Link } from 'react-router-dom';
import { KeyboardBackspaceIcon } from '../global/icons';

export const Events = () => {
	return (
		<PageLayout title='Events'>
			<Link to={`/administration`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			<></>
		</PageLayout>
	);
};
