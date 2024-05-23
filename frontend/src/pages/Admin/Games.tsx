import {
	Button,
	Box,
	Stack,
	TextField,
	Typography,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate } from 'react-router-dom';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAuth0 } from '@auth0/auth0-react';
import { useAccessToken } from '../../hooks/useAccessToken';
import { Game } from '../../types';
import { Loader } from '../../components';
import './Admin.css';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Games = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState('');
	const [icon, setIcon] = useState('');
	const [games, setGames] = useState<Game[]>([]);
	const { isAuthenticated, user } = useAuth0();
	const { accessToken } = useAccessToken();
	const navigate = useNavigate();

	async function handleRegister(event: FormEvent) {
		event.preventDefault();

		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/game`,
				method: 'POST',
				data: { name, icon },
			});

			toast.success('Game created successfully');

			setName('');
			setIcon('');
			setIsCreating(false);
			getGames();
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('Internal server error')) {
					navigate('/error/500');
				}
				toast.error(error.message);
			} else {
				navigate('/error/500');
			}
		}
	}

	async function handleDelete(game_id: number) {
		try {
			await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/game`,
				method: 'DELETE',
				data: { id: game_id },
			});

			toast.success('Game deleted successfully');

			getGames();
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('Internal server error')) {
					navigate('/error/500');
				}
				toast.error(error.message);
			} else {
				navigate('/error/500');
			}
		}
	}

	const getGames = useCallback(async () => {
		try {
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/game`,
			});

			if (response.ok) {
				const { games } = await response.json();
				setGames(games);
				setIsLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	}, [accessToken, isAuthenticated]);

	useEffect(() => {
		if (!user) return;
		if (!accessToken) return;

		getGames();
	}, [accessToken, isAuthenticated, user, getGames]);

	return (
		<PageLayout title='Games'>
			<Link to={`/administration`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			{isLoading && <Loader />}
			{!isLoading && (
				<>
					<Box>
						{!isCreating && (
							<Button
								size='small'
								color='secondary'
								variant='contained'
								onClick={() => setIsCreating(!isCreating)}
							>
								Register new game
							</Button>
						)}
						<Stack sx={{ marginTop: '16px' }}>
							{isCreating && (
								<form
									style={{
										gap: '12px',
										display: 'flex',
										justifyContent: 'center',
										flexDirection: 'column',
									}}
									onSubmit={(event) => handleRegister(event)}
								>
									<TextField
										id='game-name'
										label='Name'
										variant='outlined'
										value={name}
										onChange={(event) => {
											const name = event.target.value;
											setName(name);
										}}
										autoComplete='off'
										sx={{ maxWidth: '400px', width: '95%' }}
										inputProps={{ maxLength: 120 }}
									/>
									<TextField
										id='game-icon'
										label='Icon'
										variant='outlined'
										value={icon}
										sx={{ maxWidth: '400px', width: '95%' }}
										autoComplete='off'
										onChange={(event) => {
											const icon =
												event.target.value.trim();
											setIcon(icon);
										}}
										inputProps={{ maxLength: 120 }}
									/>
									<Box
										sx={{
											display: 'flex',
											flexWrap: 'wrap',
											maxWidth: '400px',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '6px',
										}}
									>
										<Button
											type='submit'
											color='secondary'
											variant='contained'
											sx={{
												minWidth: '190px',
												maxWidth: '300px',
												width: '95%',
											}}
										>
											Submit
										</Button>
										<Button
											type='submit'
											color='error'
											sx={{
												minWidth: '190px',
												maxWidth: '300px',
												width: '95%',
											}}
											variant='contained'
											onClick={() => setIsCreating(false)}
										>
											Cancel
										</Button>
									</Box>
								</form>
							)}
						</Stack>
					</Box>
					<Box sx={{ marginTop: '24px', maxWidth: '800px' }}>
						<Typography variant='h6'>Available games</Typography>
						{games && games.length > 0 ? (
							<TableContainer>
								<Table aria-label='a dense table' size='small'>
									<TableHead>
										<TableRow>
											<TableCell align='center'>
												ID
											</TableCell>
											<TableCell
												align='center'
												sx={{ maxWidth: '80px' }}
											>
												Icon
											</TableCell>
											<TableCell align='center'>
												Name
											</TableCell>
											<TableCell align='center'>
												Action
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{games.map((game) => (
											<TableRow
												key={game.id}
												sx={{
													'&:last-child td, &:last-child th':
														{ border: 0 },
												}}
											>
												<TableCell
													align='center'
													component='th'
													scope='row'
												>
													{game.id}
												</TableCell>
												<TableCell align='center'>
													<Typography
														sx={{
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
														}}
													>
														<img
															src={game.icon}
															alt={`${game.name} icon`}
															style={{
																height: '30px',
															}}
														/>
													</Typography>
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													{game.name}
												</TableCell>
												<TableCell
													align='center'
													sx={{
														fontWeight: 'bold',
													}}
												>
													<Button
														size='small'
														color='secondary'
														onClick={() =>
															handleDelete(
																game.id
															)
														}
													>
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Typography>
								There is no available games!
							</Typography>
						)}
					</Box>
				</>
			)}
		</PageLayout>
	);
};
