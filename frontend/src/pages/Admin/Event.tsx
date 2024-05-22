import { Link, useParams } from 'react-router-dom';
import { PageLayout } from '../../layouts/PageLayout';
import { Button, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Loader } from '../../components';
import { KeyboardBackspaceIcon } from '../../global/icons';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Event = () => {
	const { event_id } = useParams();
	const [event, setEvent] = useState<Event>();
	const [isLoading, setIsLoading] = useState<boolean>();
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();

	useEffect(() => {
		async function getEvent() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/event/details/${event_id}`,
				});

				if (response.ok) {
					const { event } = await response.json();

					setEvent(event);
					setIsLoading(false);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvent();
	}, [accessToken, isAuthenticated, user, event_id]);
	return (
		<PageLayout title={`Event ${event_id}`}>
			<Link to={`/events`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			{isLoading && <Loader />}
			{!isLoading && <Typography>{JSON.stringify(event)}</Typography>}
		</PageLayout>
	);
};
