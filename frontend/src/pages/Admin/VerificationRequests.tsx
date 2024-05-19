import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../../layouts/PageLayout';
import { Button, List, ListItem, ListItemText } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
//import useMediaQuery from '@mui/material/useMediaQuery';
//import { User } from '../../types';
import { VerificationRequest } from '../../types/VerificationRequest';
import axios from 'axios';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Link } from 'react-router-dom';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const VerificationRequests = () => {
	const [requests, setRequests] = useState<VerificationRequest[]>([]);
	const { user, isAuthenticated } = useAuth0();
	//const [currentUser, setCurrentUser] = useState<User | null>(null);
	const { accessToken } = useAccessToken();
	//const navigate = useNavigate();

	//const isMediumScreen = useMediaQuery('(min-width: 600px)');

	useEffect(() => {
		async function getRequests() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/verification-request`,
				});
				if (response.ok) {
					const data = await response.json();
					console.log(data); // <-- Verifica la respuesta aquí
					setRequests(data.verificationRequest || []); // <-- Extrae el array de verificationRequest
				}
			} catch (error) {
				console.log('Error fetching data:', error);
			}
		}

		if (!user) return;
		if (!accessToken) return;
		getRequests();
	}, [accessToken, isAuthenticated, user]);

	const handleDownload = (id: number) => {
		if (id) {
			const url = `http://${HOST}:${PORT}/verification-request/file/${id}`;
			window.open(url, '_blank');
		}
	};

	// Frontend code
	const handleAccept = async (id: number) => {
		try {
			await axios.patch(
				`http://${HOST}:${PORT}/verification-request/${id}`,
				{ id, status: 'ACCEPTED' },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setRequests(
				requests.map((req) =>
					req.id === id ? { ...req, status: 'ACCEPTED' } : req
				)
			);
		} catch (error) {
			console.log(error);
		}
	};

	const handleReject = async (id: number) => {
		try {
			await axios.patch(
				`http://${HOST}:${PORT}/verification-request/${id}`,
				{ id, status: 'REJECTED' },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			setRequests(
				requests.map((req) =>
					req.id === id ? { ...req, status: 'REJECTED' } : req
				)
			);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<PageLayout title='Player verification requests'>
			<Link to={`/administration`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			<List>
				{requests.map((request) => (
					<ListItem key={request.id}>
						<ListItemText
							primary={`Request ID: ${request.id}, Date: ${request.createdAt}`}
							//  secondary={`Status: ${request.status}`}
						/>
						<Button
							variant='contained'
							color='primary'
							onClick={() => handleDownload(request.id ?? 0)}
						>
							Download
						</Button>
						<Button
							variant='contained'
							color='success'
							onClick={() => handleAccept(request.id ?? 0)}
						>
							Accept
						</Button>
						<Button
							variant='contained'
							color='error'
							onClick={() => handleReject(request.id ?? 0)}
						>
							Reject
						</Button>
					</ListItem>
				))}
			</List>
		</PageLayout>
	);
};
