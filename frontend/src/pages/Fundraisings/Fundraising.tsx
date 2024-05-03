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

const REACT_APP_API_URL = 'http://localhost:3000';
const REACT_APP_MP_PUBLIC_KEY = 'TEST-960f6880-26b7-4fbd-b001-587fc4a7e552';

export const Fundraising = () => {
	const [amount, setAmount] = useState<number>(1);
	const [preferenceId, setPreferenceId] = useState(null); // Estado para guardar la preferenceId que me traigo del server
	const { accessToken } = useAccessToken();
	const [fundraising, setFundraising] = useState<FundraisingType>();
	const { user, isAuthenticated } = useAuth0();
	const { fundraising_id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		async function getFundraisings() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/fundraising/${fundraising_id}`,
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
	}, [accessToken, isAuthenticated, user, fundraising_id, navigate]);

	initMercadoPago(
		REACT_APP_MP_PUBLIC_KEY ?? 'TEST-960f6880-26b7-4fbd-b001-587fc4a7e552',
		{
			locale: 'es-AR',
		}
	);

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
			if (fundraising) {
				console.log(fundraising);
				const response = await axios.post(
					REACT_APP_API_URL
						? REACT_APP_API_URL + '/mercado-pago/create-preference'
						: 'http://localhost:3000/mercado-pago/create-preference',
					{
						title: `${fundraising.player.user.username} | ${fundraising.event.name} (${amount})`,
						quantity: amount,
						unit_price: fundraising.collection.current_price,
					}
				);
				const { id } = response.data;
				return id;
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
									U$D {fundraising.goal_amount}
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
									U$D {fundraising.current_amount}
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
									{fundraising.collection.amount_left}/
									{fundraising.collection.initial_amount}
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
									U$D {fundraising.event.prize}
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
										Token ID
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
													.token_price_percentage
											}
											%
										</Typography>
									</Typography>
									<Typography component='div' variant='body2'>
										Prize per token
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
											{fundraising.event.prize *
												(fundraising.prize_percentage /
													100) *
												(fundraising.collection
													.token_price_percentage /
													100)}
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
											{
												fundraising.collection
													.current_price
											}
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
							<Button
								variant='contained'
								color='secondary'
								style={{ marginTop: '8px' }}
								onClick={() =>
									console.log('Updating fundraising...')
								}
								sx={{
									maxWidth: '250px',
									display: 'block',
									paddingY: '12px',
								}}
							>
								Update your fundraising
							</Button>
						)}
						{user?.sub !== fundraising.player.user.auth0_id &&
							!preferenceId && (
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
