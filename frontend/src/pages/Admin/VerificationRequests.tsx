import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../../layouts/PageLayout';
import {
	Button,
	List,
	ListItem,
	ListItemText,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
	Box,
} from '@mui/material';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { VerificationRequest } from '../../types/VerificationRequest';
import axios from 'axios';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Link } from 'react-router-dom';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const VerificationRequests = () => {
	const [requests, setRequests] = useState<VerificationRequest[]>([]);
	const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
		null
	);
	const [confirmAction, setConfirmAction] = useState<
		'ACCEPT' | 'REJECT' | null
	>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();

	useEffect(() => {
		async function getRequests() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/verification-request`,
				});
				if (response.ok) {
					const data = await response.json();
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
			const url = `${HOST}:${PORT}/verification-request/file/${id}`;
			window.open(url, '_blank');
		}
	};

	const handleAccept = async () => {
		if (selectedRequestId !== null) {
			try {
				await axios.patch(
					`${HOST}:${PORT}/verification-request/${selectedRequestId}`,
					{ id: selectedRequestId, status: 'ACCEPTED' },
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setRequests(
					requests.map((req) =>
						req.id === selectedRequestId
							? { ...req, status: 'ACCEPTED' }
							: req
					)
				);
			} catch (error) {
				console.log(error);
			} finally {
				handleCloseDialog();
			}
		}
	};

	const handleReject = async () => {
		if (selectedRequestId !== null) {
			try {
				await axios.patch(
					`${HOST}:${PORT}/verification-request/${selectedRequestId}`,
					{ id: selectedRequestId, status: 'REJECTED' },
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);
				setRequests(
					requests.map((req) =>
						req.id === selectedRequestId
							? { ...req, status: 'REJECTED' }
							: req
					)
				);
			} catch (error) {
				console.log(error);
			} finally {
				handleCloseDialog();
			}
		}
	};

	const handleOpenDialog = (id: number, action: 'ACCEPT' | 'REJECT') => {
		setSelectedRequestId(id);
		setConfirmAction(action);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setTimeout(() => {
			setSelectedRequestId(null);
			setConfirmAction(null);
		}, 300); // Retrasa el reinicio de los estados para permitir que el diálogo se cierre correctamente
	};

	const pendingRequests = requests.filter(
		(request) => request.status === 'PENDING'
	);
	const acceptedRequests = requests.filter(
		(request) => request.status === 'ACCEPTED'
	);
	const rejectedRequests = requests.filter(
		(request) => request.status === 'REJECTED'
	);

	return (
		<PageLayout title='Verification requests'>
			<Link to={`/administration`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>

			<Box>
				<Typography variant='h6' gutterBottom>
					Pending Requests
				</Typography>
				<List>
					{pendingRequests.map((request) => (
						<ListItem
							key={request.id}
							style={{
								border: '2px solid rgba(255,255,255,0.1)',
								borderRadius: '4px',
								marginBottom: '8px',
								padding: '1rem',
							}}
						>
							<ListItemText
								primary={`Request ID: ${request.id}, Date: ${request.createdAt}`}
							/>
							<div style={{ display: 'flex', gap: '8px' }}>
								<Button
									variant='contained'
									color='secondary'
									onClick={() =>
										handleDownload(request.id ?? 0)
									}
								>
									Download
								</Button>
								<Button
									variant='contained'
									color='success'
									onClick={() =>
										handleOpenDialog(
											request.id ?? 0,
											'ACCEPT'
										)
									}
								>
									Accept
								</Button>
								<Button
									variant='contained'
									color='error'
									onClick={() =>
										handleOpenDialog(
											request.id ?? 0,
											'REJECT'
										)
									}
								>
									Reject
								</Button>
							</div>
						</ListItem>
					))}
				</List>
			</Box>

			<Box mt={4}>
				<Typography variant='h6' gutterBottom>
					Accepted Requests
				</Typography>
				<List>
					{acceptedRequests.map((request) => (
						<ListItem
							key={request.id}
							style={{
								border: '2px solid rgba(93, 255, 114, 0.2)',
								borderRadius: '4px',
								marginBottom: '8px',
								padding: '1rem',
							}}
						>
							<ListItemText
								primary={`Request ID: ${request.id}, Date: ${request.createdAt}`}
							/>
							<div style={{ display: 'flex', gap: '8px' }}>
								<Button
									variant='contained'
									color='secondary'
									onClick={() =>
										handleDownload(request.id ?? 0)
									}
								>
									Download
								</Button>
							</div>
						</ListItem>
					))}
				</List>
			</Box>

			<Box mt={4}>
				<Typography variant='h6' gutterBottom>
					Rejected Requests
				</Typography>
				<List>
					{rejectedRequests.map((request) => (
						<ListItem
							key={request.id}
							style={{
								border: '2px solid rgba(250, 45, 45, 0.2)',
								borderRadius: '4px',
								marginBottom: '8px',
								padding: '1rem',
							}}
						>
							<ListItemText
								primary={`Request ID: ${request.id}, Date: ${request.createdAt}`}
							/>
							<div style={{ display: 'flex', gap: '8px' }}>
								<Button
									variant='contained'
									color='secondary'
									onClick={() =>
										handleDownload(request.id ?? 0)
									}
								>
									Download
								</Button>
							</div>
						</ListItem>
					))}
				</List>
			</Box>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{`Are you sure you want to ${
						confirmAction ? confirmAction.toLowerCase() : ''
					} this request?`}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						This action cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={
							confirmAction === 'ACCEPT'
								? handleAccept
								: handleReject
						}
						color='success'
						autoFocus
					>
						Confirm
					</Button>
					<Button onClick={handleCloseDialog} color='error'>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</PageLayout>
	);
};
