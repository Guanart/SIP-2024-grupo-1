import { FormEvent, useEffect, useState } from 'react';
import { PageLayout } from '../../layouts/PageLayout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	Button,
	Card,
	CardContent,
	CardMedia,
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
import { Container } from '@mui/material';
import { Loader } from '../../components';

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
					url: `http://localhost:3000/user/${user?.sub}`,
				});

				if (response.ok) {
					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://localhost:3000/fundraising/${fundraising_id}`,
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
		console.log('Updating fundraising...');
		event.preventDefault();

		const updatedFundraising = {
			goal_amount: goalAmount,
			initial_price: initialPrice,
		};

		try {
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://localhost:3000/fundraising/${fundraising_id}`,
				method: 'PUT',
				data: updatedFundraising,
			});

			if (response.ok) {
				const { message, fundraising } = await response.json();
				console.log(message);
				navigate(`/fundraising/${fundraising.id}`);
			}
		} catch (error) {
			navigate(`/error`);
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
		<PageLayout title='Update your fundraising'>
			<Link to={`/fundraising/${fundraising_id}`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>

			<form
				onSubmit={(event) => handleUpdateFundraising(event)}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
					minWidth: '400px',
					marginTop: '24px',
					...(window.innerWidth <= 900 && {
						marginTop: '0px', // Cambiar el marginTop para pantallas pequeñas
					}),
				}}
			>
				<Typography variant='h6'>New fundraising</Typography>
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
		</PageLayout>
	);
};
