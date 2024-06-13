import { useState, useEffect } from 'react';
import {
	Stack,
	Typography,
	LinearProgress,
	TextField,
	Button,
} from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Fundraising as FundraisingType } from '../../types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { KeyboardBackspaceIcon } from '../../global/icons';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

const REACT_APP_API_URL = `${HOST}:${PORT}/mercado-pago/create-preference`;
const REACT_APP_PREFERENCE_TYPE = 'fundraising';

export const Fundraising = () => {
	const [amount, setAmount] = useState<number>(1);
	const [preferenceId, setPreferenceId] = useState(null); // Estado para guardar la preferenceId que me traigo del server
	const { accessToken, role } = useAccessToken();
	const [fundraising, setFundraising] = useState<FundraisingType>();
	const { user, isAuthenticated } = useAuth0();
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		async function getFundraisings() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/fundraising/${id}`,
				});

				if (response.ok) {
					const { fundraising } = await response.json();
					setFundraising(fundraising);
				} else {
					navigate('/error');
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getFundraisings();
	}, [accessToken, isAuthenticated, user, id, navigate]);

	if (fundraising && fundraising.player.public_key) {
		initMercadoPago(fundraising.player.public_key, {
			locale: 'es-AR',
		});
	}

	function handleAmountChange(value: string) {
		const nextAmount: number = parseInt(value.trim()) ?? 1;
		if (nextAmount > 0) {
			setAmount(nextAmount);
		} else {
			setAmount(1);
		}
	}

	const createPreference = async () => {
		try {
			// Recupero wallet del usuario
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/user/${user?.sub}`,
			});

			let walletId;
			if (response.ok) {
				const { user } = await response.json();
				walletId = user.wallet.id;
				console.log('WalletID', user.wallet.id);
			}

			// Creo Preference
			if (fundraising && walletId) {
				const response = await axios.post(REACT_APP_API_URL, {
					id: id,
					buyer_wallet_id: walletId, // wallet id del usuario que compra
					title: `${fundraising.player.user.username} | ${fundraising.event.name} (${amount})`,
					quantity: amount,
					unit_price: fundraising.collection.current_price,
					type: REACT_APP_PREFERENCE_TYPE,
				});
				return response.data.id;
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleBuy = async () => {
		const id = await createPreference();
		if (id) {
			setPreferenceId(id);
		}
	};

	return (
		<PageLayout title='Fundraising'>
			<Link to={`/fundraisings`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>{' '}
					Back
				</Button>
			</Link>
			{fundraising && (
				<>
					<Stack
						direction={{ xs: 'column', md: 'row' }}
						spacing={{ xs: '24px', md: '48px' }}
						sx={{ paddingTop: '8px', justifyContent: 'center' }}
					>
						<Stack
							sx={{ paddingX: '0px', width: '350px' }}
							spacing='8px'
						>
							<Typography component='div' variant='h6'>
								Goal amount
								<Typography
									color='secondary'
									component='div'
									variant='h6'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									U$D{' '}
									{fundraising.goal_amount.toLocaleString()}
								</Typography>
							</Typography>
							<Typography component='div' variant='h6'>
								Goal progress
								<Typography
									color='secondary'
									component='div'
									variant='h6'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									U$D{' '}
									{fundraising.current_amount.toLocaleString()}
									<LinearProgress
										variant='determinate'
										value={
											(fundraising.current_amount * 100) /
											fundraising.goal_amount
										}
										color='secondary'
										sx={{
											height: '20px',
											ml: '2px',
											mt: '4px',
											maxWidth: '250px',
										}}
									/>
								</Typography>
							</Typography>
							<Typography component='div' variant='h6'>
								Tokens left
								<Typography
									color='secondary'
									component='div'
									variant='h6'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									(
									{fundraising.collection.amount_left.toLocaleString()}
									/
									{fundraising.collection.initial_amount.toLocaleString()}
									)
									<LinearProgress
										variant='determinate'
										value={
											(fundraising.collection
												.amount_left *
												100) /
											fundraising.collection
												.initial_amount
										}
										color='secondary'
										sx={{
											height: '20px',
											ml: '2px',
											mt: '4px',
											maxWidth: '250px',
										}}
									/>
								</Typography>
							</Typography>
							<Typography component='div' variant='h6'>
								Event prize
								<Typography
									color='secondary'
									component='div'
									variant='h6'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									U$D{' '}
									{fundraising.event.prize.toLocaleString()}
								</Typography>
							</Typography>
							<Typography component='div' variant='h6'>
								Percentage of prize
								<Typography
									color='secondary'
									component='div'
									variant='h6'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									{fundraising.prize_percentage}%
								</Typography>
							</Typography>
							<Typography component='div' variant='h6'>
								Token details
								<Stack sx={{ paddingLeft: '8px' }}>
									<Typography component='div' variant='body2'>
										Collection ID
										<Typography
											color='secondary'
											component='div'
											variant='body2'
											sx={{
												display: 'inline',
												marginLeft: '6px',
												fontWeight: 'bold',
											}}
										>
											{fundraising.collection.id}
										</Typography>
									</Typography>
									<Typography component='div' variant='body2'>
										Token price
										<Typography
											color='secondary'
											component='div'
											variant='body2'
											sx={{
												display: 'inline',
												marginLeft: '6px',
												fontWeight: 'bold',
											}}
										>
											U$D{' '}
											{fundraising.collection.current_price.toLocaleString()}
										</Typography>
									</Typography>
									<Typography component='div' variant='body2'>
										Percentage per token
										<Typography
											color='secondary'
											component='div'
											variant='body2'
											sx={{
												display: 'inline',
												marginLeft: '6px',
												fontWeight: 'bold',
											}}
										>
											{
												fundraising.collection
													.token_prize_percentage
											}
											%
										</Typography>
									</Typography>
									<Typography component='div' variant='body2'>
										Revenue per token
										<Typography
											color='secondary'
											component='div'
											variant='body2'
											sx={{
												display: 'inline',
												marginLeft: '6px',
												fontWeight: 'bold',
											}}
										>
											Max. U$D{' '}
											{(
												fundraising.event.prize *
												(fundraising.prize_percentage /
													100) *
												fundraising.collection
													.token_prize_percentage
											).toLocaleString()}
										</Typography>
									</Typography>
								</Stack>
							</Typography>
						</Stack>
						<FundraisingCard
							showActions={false}
							fundraising={fundraising}
						/>
					</Stack>
					<Stack
						sx={{
							mx: 'auto',
							mt: '0px',
							width: '750px',
						}}
						direction='row'
						spacing='4px'
					>
						{user?.sub === fundraising.player.user.auth0_id && (
							<Link
								to={`/fundraising/update/${fundraising.id}`}
								style={{ textDecoration: 'none' }}
							>
								<Button
									variant='contained'
									color='secondary'
									style={{ marginTop: '8px' }}
									sx={{
										maxWidth: '250px',
										display: 'block',
										paddingY: '12px',
									}}
								>
									Update fundraising
								</Button>
							</Link>
						)}
						{user?.sub !== fundraising.player.user.auth0_id &&
							!preferenceId &&
							role !== 'admin' && (
								<>
									<TextField
										id='outlined-number'
										label='Amount'
										type='number'
										value={amount}
										onChange={(event) =>
											handleAmountChange(
												event.target.value
											)
										}
										inputProps={{ maxLength: 80 }}
										sx={{ maxWidth: '100px' }}
									/>
									<Button
										variant='contained'
										color='secondary'
										onClick={handleBuy}
										style={{ maxWidth: '250px' }}
									>
										Buy
									</Button>
								</>
							)}
						{user?.sub !== fundraising.player.user.auth0_id &&
							preferenceId && (
								<Wallet
									initialization={{
										preferenceId: preferenceId,
									}}
								/>
							)}
					</Stack>
				</>
			)}
		</PageLayout>
	);
};
