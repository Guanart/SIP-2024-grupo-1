import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { PageLayout } from '../../layouts/PageLayout';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { FormEvent, useEffect, useState } from 'react';
import { UpdatedUser, User } from '../../types';
import { useParams } from 'react-router-dom';
import {
	Avatar,
	Container,
	Stack,
	Typography,
	Box,
	Button,
	TextField,
} from '@mui/material';
import { BasicModal, Loader } from '../../components';
import './Account.css';

export const Account = () => {
	const { auth0_id } = useParams();

	const { accessToken, role } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [updatedUser, setUpdatedUser] = useState<UpdatedUser | null>(null);

	useEffect(() => {
		if (!isAuthenticated) return;

		fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/user/${auth0_id}`,
			method: 'GET',
		})
			.then((response) => {
				if (!response.ok) return;

				return response.json();
			})
			.then((data) => {
				const { user } = data;

				if (!user) return;

				setIsLoading(false);
				setCurrentUser(user);

				if (!updatedUser) {
					if (role === 'player') {
						setUpdatedUser({
							auth0_id: user.auth0_id,
							username: user.username,
							avatar: user.avatar,
							biography: user.biography,
						});
					} else {
						setUpdatedUser({
							auth0_id: user.auth0_id,
							username: user.username,
							avatar: user.avatar,
						});
					}
				}
			});
	}, [user, isAuthenticated, accessToken, updatedUser, role, auth0_id]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		setIsLoading(true);

		const response = await fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/user`,
			method: 'PUT',
			data: updatedUser,
		});

		setUpdatedUser(null);

		if (!response.ok) {
			throw Error('Error updating user profile');
		}

		setIsOpen(false);
	}

	return (
		<PageLayout>
			<Container>
				<Typography variant='h5' component='h2' color='primary'>
					My profile
				</Typography>
				{isLoading && <Loader />}
				{!isLoading && currentUser && (
					<Container sx={{ mt: '16px' }}>
						<Stack
							spacing={2}
							direction='column'
							justifyContent='start'
							alignItems='left'
						>
							<Stack spacing={2}>
								<Stack spacing={2} direction='row'>
									<Avatar
										alt={currentUser.username}
										src={currentUser.avatar}
										sx={{ width: 56, height: 56 }}
									/>
									<Box>
										<Typography variant='h6' component='h3'>
											{currentUser.username}
											<Typography
												variant='subtitle1'
												component='span'
												sx={{
													px: '8px',
													fontWeight: 'normal',
													color: 'grey',
												}}
											>
												{currentUser.email}
											</Typography>
										</Typography>
										<Typography
											variant='subtitle2'
											component='span'
											sx={{
												py: '2px',
												fontWeight: 'normal',
											}}
										>
											Argentina
										</Typography>
									</Box>
									{user?.sub === auth0_id && (
										<Button
											variant='contained'
											color='secondary'
											sx={{
												maxHeight: '40px',
												minWidth: '125px',
												maxWidth: '160px',
											}}
											onClick={() => setIsOpen(true)}
										>
											Edit profile
										</Button>
									)}
								</Stack>
							</Stack>
						</Stack>
					</Container>
				)}
			</Container>

			<BasicModal
				title='Edit profile'
				isOpen={isOpen}
				handleClose={() => setIsOpen(false)}
			>
				<form onSubmit={handleSubmit} className='edit-profile-form'>
					<TextField
						disabled
						id='outlined-disabled'
						label='Email'
						value={currentUser?.email}
						inputProps={{ maxLength: 80 }}
					/>
					<TextField
						id='outlined-basic'
						label='Username'
						variant='outlined'
						value={updatedUser?.username}
						onChange={(event) => {
							const username =
								event.target.value.trim() ??
								currentUser?.username;
							setUpdatedUser({
								...updatedUser,
								['username']: username,
							});
						}}
						inputProps={{ maxLength: 80 }}
					/>
					<TextField
						id='outlined-basic'
						label='Avatar'
						variant='outlined'
						value={updatedUser?.avatar}
						onChange={(event) => {
							const avatar =
								event.target.value.trim() ??
								currentUser?.avatar;
							setUpdatedUser({
								...updatedUser,
								['avatar']: avatar,
							});
						}}
						inputProps={{ maxLength: 120 }}
					/>
					{role === 'player' && (
						<TextField
							id='outlined-basic'
							label='Biography'
							variant='outlined'
							multiline
							maxRows={4}
							onChange={(event) => {
								const biography =
									event.target.value.trim() ??
									currentUser?.biography;
								setUpdatedUser({
									...updatedUser,
									['biography']: biography,
								});
							}}
							value={updatedUser?.biography}
							inputProps={{ maxLength: 200 }}
						/>
					)}
					<Box>
						<Button
							variant='contained'
							sx={{
								display: 'block',
								width: '90%',
								margin: 'auto',
								py: '8px',
							}}
							type='submit'
						>
							Save changes
						</Button>
						<Button
							variant='contained'
							color='error'
							onClick={() => setIsOpen(false)}
							sx={{
								display: 'block',
								width: '90%',
								margin: 'auto',
								py: '8px',
								marginTop: '8px',
							}}
						>
							Cancel
						</Button>
					</Box>
				</form>
			</BasicModal>

			{!isLoading && (
				<>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2' color='primary'>
							Tokens
						</Typography>
						<p>
							Acá pensaba mostrar los 5 tokens más valiosos o algo
							por el estilo
						</p>
					</Container>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2' color='primary'>
							Marketplace
						</Typography>
						<p>
							Acá pensaba mostrar las últimas 5 publicaciones del
							Marketplace
						</p>
					</Container>
				</>
			)}
		</PageLayout>
	);
};
