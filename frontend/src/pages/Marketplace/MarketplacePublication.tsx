import { useState, useEffect } from 'react';
import { Stack, Typography, Button, Avatar, Box } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { MarketplacePublication as MarketplacePublicationType } from '../../types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { KeyboardBackspaceIcon } from '../../global/icons';
import './Marketplace.css';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;
const REACT_APP_API_URL = `http://${HOST}:${PORT}/mercado-pago/create-preference`;
const REACT_APP_PREFERENCE_TYPE = 'marketplace';

export const MarketplacePublication = () => {
	const [preferenceId, setPreferenceId] = useState(null); // Estado para guardar la preferenceId que me traigo del server
	const { accessToken, role } = useAccessToken();
	const [marketplacePublication, setMarketplacePublication] =
		useState<MarketplacePublicationType>();
	const { user, isAuthenticated } = useAuth0();
	const { publication_id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		async function getPublication() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/marketplace/${publication_id}`,
				});

				if (response.ok) {
					const { publication } = await response.json();
					setMarketplacePublication(publication);
				} else {
					navigate('/error');
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getPublication();
	}, [accessToken, isAuthenticated, user, publication_id, navigate]);

	if (marketplacePublication && marketplacePublication.out_wallet.public_key) {
		initMercadoPago(marketplacePublication.out_wallet.public_key, {
			locale: 'es-AR',
		});
	}
	const createPreference = async () => {
		try {
			// Recupero wallet del usuario
			let response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `http://${HOST}:${PORT}/user/${user?.sub}`,
			});

			let walletId;
			if (response.ok) {
				const { user } = await response.json();
				walletId = user.wallet.id
				console.log('WalletID', user.wallet.id);
			}
			
			// Creo Preference
			if (marketplacePublication && walletId) {
				const username =
					marketplacePublication.out_wallet.user?.username;
				marketplacePublication.token.collection.fundraising;
				const response = await axios.post(REACT_APP_API_URL, {
					id: publication_id,
					buyer_wallet_id: walletId, // wallet id del usuario que compra
					title: `${username} | Token ID: ${marketplacePublication.token.id}`,
					quantity: 1,
					unit_price: marketplacePublication.price,
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

	const handleDeletePublication = async () => {
		const response = await fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://${HOST}:${PORT}/marketplace/${publication_id}`,
			method: 'DELETE',
		});

		if (response.ok) {
			navigate('/marketplace');
		} else {
			navigate('/error');
		}
	};

	return (
		<PageLayout title='Marketplace publication'>
			<Link to={`/marketplace`}>
				<Button size='small' color='secondary'>
					<KeyboardBackspaceIcon
						sx={{ marginRight: '4px', marginY: '16px' }}
					/>
					Back
				</Button>
			</Link>
			{marketplacePublication && (
				<Stack
					direction={{ xs: 'column', md: 'row-reverse' }}
					spacing={{ xs: '24px', md: '48px' }}
					sx={{ paddingTop: '8px', justifyContent: 'center' }}
				>
					<Stack
						sx={{ paddingX: '0px', width: '350px' }}
						spacing='8px'
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<Avatar
								src={
									marketplacePublication.out_wallet.user
										?.avatar
								}
								sx={{
									display: 'inline-block',
									width: '60px',
									height: '60px',
								}}
							/>
							<Typography component='div'>
								<Typography variant='h6'>
									{
										marketplacePublication.out_wallet.user
											?.username
									}
								</Typography>
								<Typography>
									{new Date(
										marketplacePublication.date
									).toUTCString()}
								</Typography>
							</Typography>
						</Box>

						<Typography component='div' variant='h6'>
							Price
							<Typography
								color='secondary'
								component='div'
								sx={{
									fontWeight: 'bold',
								}}
							>
								U$D {marketplacePublication.price}
							</Typography>
						</Typography>
						<Typography component='div' variant='h6'>
							Revenue
							<Typography
								color='secondary'
								component='div'
								sx={{
									fontWeight: 'bold',
								}}
							>
								Max. U$D{' '}
								{marketplacePublication.token.collection
									.fundraising.event.prize *
									(marketplacePublication.token.collection
										.fundraising.prize_percentage /
										100) *
									marketplacePublication.token.collection
										.token_prize_percentage}
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
										{
											marketplacePublication.token
												.collection.id
										}
									</Typography>
								</Typography>
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
										{marketplacePublication.token.id}
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
											marketplacePublication.token
												.collection
												.token_prize_percentage
										}
										%
									</Typography>
								</Typography>
							</Stack>
						</Typography>
						{user?.sub ===
							marketplacePublication.out_wallet.user
								?.auth0_id && (
							<Button
								variant='contained'
								color='error'
								style={{ marginTop: '16px' }}
								onClick={() => handleDeletePublication()}
								sx={{
									maxWidth: '250px',
									display: 'block',
									paddingY: '12px',
								}}
							>
								Delete publication
							</Button>
						)}
						{user?.sub !==
							marketplacePublication.out_wallet.user?.auth0_id &&
							!preferenceId &&
							role !== 'admin' && (
								<Button
									variant='contained'
									color='secondary'
									onClick={handleBuy}
									style={{
										maxWidth: '250px',
										marginTop: '16px',
									}}
								>
									Buy
								</Button>
							)}
						{user?.sub !==
							marketplacePublication.out_wallet.user?.auth0_id &&
							preferenceId && (
								<Wallet
									initialization={{
										preferenceId: preferenceId,
									}}
								/>
							)}
					</Stack>
					<FundraisingCard
						showActions={false}
						fundraising={
							marketplacePublication.token.collection.fundraising
						}
					/>
				</Stack>
			)}
		</PageLayout>
	);
};
