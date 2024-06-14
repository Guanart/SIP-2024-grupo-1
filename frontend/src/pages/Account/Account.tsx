import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks';
import { PageLayout } from '../../layouts/PageLayout';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { FormEvent, useEffect, useState } from 'react';
import { UpdatedUser, User } from '../../types';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
	Avatar,
	Container,
	Stack,
	Typography,
	Box,
	Button,
	TextField,
} from '@mui/material';
import {
	BasicModal,
	Loader,
	MostValuableTokensList,
	PublicationList,
} from '../../components';
import './Account.css';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Account = () => {
	const { auth0_id } = useParams();
	const { accessToken, role } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const navigate = useNavigate();
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [updatedUser, setUpdatedUser] = useState<UpdatedUser | null>(null);
	const [biography, setBiography] = useState<string>('');

	useEffect(() => {
		if (!isAuthenticated) return;
		if (updatedUser) return;

		fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `${HOST}:${PORT}/user/${auth0_id}`,
			method: 'GET',
		})
			.then((response) => {
				if (!response.ok) return;

				return response.json();
			})
			.then((data) => {
				const { user } = data;

				console.log(data);

				if (!user) return;

				setIsLoading(false);
				setCurrentUser(user);

				if (!updatedUser) {
					setUpdatedUser({
						auth0_id: user.auth0_id,
						username: user.username,
						avatar: user.avatar,
					});

					if (role === 'player') {
						setBiography(user.player.biography);
					}
				}
			});
	}, [user, isAuthenticated, accessToken, updatedUser, role, auth0_id]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();

		setIsLoading(true);

		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/user`,
				method: 'PUT',
				data: updatedUser,
			});

			if (role === 'player') {
				if (currentUser?.player?.biography !== biography) {
					const response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/player`,
						method: 'PUT',
						data: {
							player_id: currentUser?.player?.id,
							biography,
						},
					});

					if (!response.ok) {
						navigate('/error/500');
					}
				}
			}

			setIsEditModalOpen(false);
			setUpdatedUser(null);
			setIsLoading(false);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('Internal Server Error')) {
					navigate('/error/500');
				}

				toast.error(error.message);
				setIsEditModalOpen(false);
				setIsLoading(false);
				setUpdatedUser(null);
			} else {
				navigate('/error/500');
			}
		}
	}

	async function handleClick() {
		const response = await fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `${HOST}:${PORT}/user`,
			method: 'DELETE',
			data: {
				auth0_id: user?.sub,
			},
		});

		if (!response.ok) {
			navigate('/error/500');
		}

		navigate('/login');
	}

	return (
		<PageLayout title='Account'>
			<Container>
				{isLoading && <Loader />}
				{!isLoading && currentUser && (
					<Container sx={{ mt: '16px', pl: '0px' }}>
						<Stack
							spacing={2}
							direction='column'
							justifyContent='start'
							alignItems='left'
						>
							<Stack spacing={2}>
								<Stack
									spacing={2}
									direction='row'
									sx={{
										flexWrap: 'wrap',
										gap: '12px',
									}}
								>
									<Avatar
										alt={currentUser.username}
										src={currentUser.avatar}
										sx={{ width: 60, height: 60 }}
									/>
									<Box className='remove-margin'>
										<Typography variant='h6' component='h3'>
											{currentUser.username}
											<Typography
												variant='subtitle1'
												component='span'
												sx={{
													px: '8px',
													fontWeight: 'normal',
													color: '#BDBDBD',
												}}
											>
												{currentUser.email}
											</Typography>
										</Typography>
										{role === 'player' && (
											<>
												<Typography
													component='span'
													color='secondary'
													sx={{
														display: 'inline-block',
														py: '2px',
														fontWeight: 'bold',
													}}
												>
													{
														currentUser.player?.game
															.name
													}
												</Typography>
												<Typography
													component='span'
													sx={{
														px: '6px',
														fontWeight: 'normal',
														marginLeft: '0px',
													}}
												>
													|
												</Typography>
											</>
										)}
										<Typography
											component='span'
											sx={{
												py: '2px',
												fontWeight: 'bold',
												marginLeft: '0px',
											}}
										>
											Argentina
										</Typography>
									</Box>
									{user?.sub === auth0_id && (
										<Stack
											sx={{
												flexDirection: 'row',
												gap: '8px',
											}}
										>
											<Button
												variant='contained'
												color='secondary'
												sx={{
													maxHeight: '40px',
													minWidth: '125px',
													maxWidth: '160px',
												}}
												onClick={() =>
													setIsEditModalOpen(true)
												}
											>
												Edit profile
											</Button>
											<Button
												variant='contained'
												color='error'
												sx={{
													maxHeight: '40px',
													minWidth: '145px',
													maxWidth: '160px',
												}}
												onClick={() =>
													setIsDeleteModalOpen(true)
												}
											>
												Delete account
											</Button>
										</Stack>
									)}
								</Stack>
								{role === 'player' && (
									<Typography
										component='p'
										sx={{
											py: '2px',
											fontWeight: 'normal',
										}}
									>
										{currentUser.player?.biography}
									</Typography>
								)}
							</Stack>
						</Stack>
					</Container>
				)}
			</Container>

			<BasicModal
				title='Edit profile'
				isOpen={isEditModalOpen}
				handleClose={() => setIsEditModalOpen(false)}
			>
				<form onSubmit={handleSubmit} className='edit-profile-form'>
					<TextField
						disabled
						id='email'
						label='Email'
						value={currentUser?.email}
						inputProps={{ maxLength: 80 }}
					/>
					<TextField
						id='username'
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
						id='avatar'
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
							id='biography'
							label='Biography'
							variant='outlined'
							multiline
							maxRows={4}
							onChange={(event) => {
								const biography =
									event.target.value ??
									currentUser?.player?.biography;
								setBiography(biography);
							}}
							value={biography}
							type='text'
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
							onClick={() => setIsEditModalOpen(false)}
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

			<BasicModal
				title='Delete account'
				isOpen={isDeleteModalOpen}
				handleClose={() => setIsDeleteModalOpen(false)}
			>
				<>
					<Typography
						variant='h6'
						component='h4'
						sx={{
							paddingLeft: '4px',
							fontSize: '1rem',
							fontWeight: 'normal',
						}}
					>
						Are you sure you want to delete your account?
					</Typography>

					<Box sx={{ marginTop: '16px' }}>
						<Button
							variant='contained'
							color='error'
							onClick={() => handleClick()}
							sx={{
								display: 'block',
								width: '90%',
								margin: 'auto',
								py: '8px',
							}}
						>
							Delete account
						</Button>
						<Button
							variant='contained'
							sx={{
								display: 'block',
								width: '90%',
								margin: 'auto',
								py: '8px',
								marginTop: '8px',
							}}
							onClick={() => setIsDeleteModalOpen(false)}
						>
							Cancel
						</Button>
					</Box>
				</>
			</BasicModal>

			{!isLoading && (
				<>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2'>
							Most valuable tokens
						</Typography>
						<MostValuableTokensList />
					</Container>
					<Container sx={{ mt: '24px' }}>
						<Typography variant='h6' component='h2'>
							Marketplace
						</Typography>
						<PublicationList />
					</Container>
				</>
			)}
		</PageLayout>
	);
};
