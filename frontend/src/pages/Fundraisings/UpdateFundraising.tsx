import { FormEvent, useEffect, useState } from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	Button,
	Card,
	CardContent,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { Fundraising } from '../../types';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '../../components';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const UpdateFundraising = () => {
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [goalAmount, setGoalAmount] = useState<number | string>('');
	const [initialPrice, setInitialPrice] = useState<number | string>('');
	const [allowedPrices, setAllowedPrices] = useState<number[]>([]);
	const [fundraising, setFundraising] = useState<Fundraising>();
	const navigate = useNavigate();
	const { fundraising_id } = useParams();

	useEffect(() => {
		async function getEvents() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/user/${user?.sub}`,
				});

				if (response.ok) {
					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://${HOST}:${PORT}/fundraising/${fundraising_id}`,
					});

					if (response.ok) {
						const { fundraising } = await response.json();
						setFundraising(fundraising);
						console.log(fundraising);
						setInitialPrice(fundraising.collection.current_price);
						setGoalAmount(fundraising.goal_amount);
						console.log(fundraising.collection.current_price);

						setIsLoading(false);
					}
				}
			} catch (error) {
				navigate(`/error/500`);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getEvents();
	}, [accessToken, isAuthenticated, user, navigate, fundraising_id]);

	useEffect(() => {
		if (!fundraising) return;

		const lowerPrices: number[] = [fundraising.collection.current_price];
		let previousPrice: number = lowerPrices[0];

		while (Math.floor(previousPrice / 2) > 0) {
			lowerPrices.push(previousPrice / 2);
			previousPrice = lowerPrices[lowerPrices.length - 1];
		}

		setAllowedPrices(lowerPrices);
	}, [fundraising]);

	async function handleUpdateFundraising(event: FormEvent) {
		event.preventDefault();

		const updatedFundraising = {
			initial_price: initialPrice,
		};

		try {
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/fundraising/${fundraising_id}`,
				method: 'PUT',
				data: updatedFundraising,
			});

			if (response.ok) {
				const { message, fundraising } = await response.json();
				console.log(message);
				navigate(`/fundraising/${fundraising.id}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('Internal Server Error')) {
					navigate('/error/500');
				}
				toast.error(error.message);
			} else {
				navigate('/error/500');
			}
		}
	}

	if (isLoading || !fundraising) {
		return (
			<PageLayout title='Update your fundraising'>
				<Link to={`/fundraising/${fundraising_id}`}>
					<Button size='small' color='secondary'>
						<KeyboardBackspaceIcon
							sx={{ marginRight: '4px', marginY: '16px' }}
						/>{' '}
						Back
					</Button>
				</Link>{' '}
				<Loader />
			</PageLayout>
		);
	}

	return (
		<PageLayout title='Update fundraising'>
			<Link to={`/fundraising/${fundraising_id}`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>

			<Stack direction={{ xs: 'column-reverse', md: 'row' }} spacing={2}>
				<form
					onSubmit={(event) => handleUpdateFundraising(event)}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						minWidth: '400px',
						marginTop: '8px',
						...(window.innerWidth <= 900 && {
							marginTop: '0px', // Cambiar el marginTop para pantallas pequeñas
						}),
					}}
				>
					<Typography sx={{ maxWidth: '400px', fontSize: '18px' }}>
						You can only decrease the token price or increase the
						goal amount
					</Typography>
					<TextField
						id='event-name'
						value={fundraising.event.name}
						label='Event'
						sx={{ maxWidth: '400px', width: '90%' }}
						disabled={true}
					/>
					<TextField
						id='prize-percentage'
						value={fundraising.prize_percentage}
						label='Prize percentage (%)'
						sx={{ maxWidth: '400px', width: '90%' }}
						type='number'
						disabled={true}
					/>
					<TextField
						id='goal-amount'
						value={goalAmount}
						label='Goal amount (U$D)'
						sx={{ maxWidth: '400px', width: '90%' }}
						type='number'
						disabled={true}
						onChange={(event) => {
							const value = Number(event.target.value);
							if (value < 0) {
								setGoalAmount(0);
							} else {
								setGoalAmount(event.target.value);
							}
						}}
					/>
					<FormControl>
						<InputLabel id='token-price'>
							Token new price (U$D)
						</InputLabel>
						<Select
							labelId='token-new-price'
							id='token-price-select'
							label='Token new price (U$D)'
							sx={{ maxWidth: '400px', width: '90%' }}
							type='number'
							onChange={(event) =>
								setInitialPrice(Number(event.target.value))
							}
							value={initialPrice}
						>
							{allowedPrices.map((price) => {
								return (
									<MenuItem key={price} value={price}>
										{price}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					<Button
						variant='contained'
						color='secondary'
						type='submit'
						sx={{ maxWidth: '400px', width: '90%' }}
					>
						Update fundraising
					</Button>
				</form>
				<Container sx={{ paddingX: '0px !important' }}>
					<Typography variant='h6'>Your fundraising</Typography>
					<Card
						variant='outlined'
						sx={{ maxWidth: '400px', mt: '8px', paddingY: '0px' }}
					>
						<CardContent>
							<Typography
								sx={{ fontSize: 15, fontWeight: 'bold' }}
								color='secondary'
								gutterBottom
							>
								{fundraising.player.user.username}
							</Typography>
							<Typography
								component='div'
								sx={{ fontWeight: 'bold' }}
							>
								Event
								<Typography
									component='p'
									variant='h6'
									color='secondary'
								>
									{fundraising.event.name}
								</Typography>
							</Typography>
							<Typography
								sx={{ fontWeight: 'bold' }}
								component='div'
							>
								Game
								<Typography
									component='p'
									variant='h6'
									color='secondary'
								>
									{fundraising.player.game.name}
								</Typography>
							</Typography>

							<Typography sx={{ fontWeight: 'bold' }}>
								Initial tokens
								<Typography
									component='p'
									variant='h6'
									color='secondary'
								>
									{fundraising.collection.initial_amount.toLocaleString()}{' '}
									(
									{fundraising.collection.amount_left.toLocaleString()}{' '}
									left)
								</Typography>
							</Typography>
							<hr
								style={{
									marginTop: '8px',
									marginBottom: '8px',
								}}
							/>
							<Typography variant='h6' component='div'>
								Goal amount
								<Typography
									component='p'
									variant='h6'
									color='secondary'
								>
									U$D{' '}
									{fundraising.goal_amount.toLocaleString()}
								</Typography>
							</Typography>
							<Typography variant='h6' component='div'>
								Token price
								<Typography
									component='p'
									variant='h6'
									color='secondary'
								>
									U$D
									{fundraising.collection.current_price.toLocaleString()}
								</Typography>
							</Typography>
						</CardContent>
					</Card>
				</Container>
			</Stack>
		</PageLayout>
	);
};
