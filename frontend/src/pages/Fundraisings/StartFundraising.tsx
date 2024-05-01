import React from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';

export const StartFundraising = () => {
	return (
		<PageLayout title='Start your fundraising'>
			<Link to={`/fundraisings`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			<p>Create Fundraising form...</p>
		</PageLayout>
	);
};
