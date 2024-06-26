import {
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
	TableContainer,
	Stack,
	Button,
} from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { User, useAuth0 } from '@auth0/auth0-react';
import Typography from '@mui/material/Typography';
import { Token_wallet, Wallet as WalletType } from '../../types';
import { Transaction as TransactionType, Player } from '../../types';
import { useNavigate } from 'react-router-dom';
import { TokensList } from '../../components/wallet/TokensList';
import { Loader } from '../../components';
import './Wallet.css';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const Wallet = () => {
	const [wallet, setWallet] = useState<WalletType | null>(null);
	const [player, setPlayer] = useState<Player | null>(null);
	const [transactions, setTransactions] = useState<TransactionType[] | null>(
		null
	);
	const [tokens, setTokens] = useState<Token_wallet[]>([]);
	const { accessToken } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const navigate = useNavigate();

	useEffect(() => {
		async function getUserWallet(user: User) {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/user/${user?.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();

					if (user.player) {
						setPlayer(user.player);
					}

					if (user.wallet) {
						console.log(user.wallet);
						setTokens(user.wallet.token_wallet);
						setWallet(user.wallet);
						setTransactions(user.wallet.transactions);
						console.log(user.wallet.transactions);
					}
				}
			} catch (error) {
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getUserWallet(user);
	}, [accessToken, isAuthenticated, user, navigate]);

	const getColorByTypeId: { [key: string]: string } = {
		BUY: '#45FFCA',
		SELL: 'rgba(147, 11, 11, 0.8)',
	};

	// const CLIENT_ID = "3437331959866275"; // app cuenta real
	const CLIENT_ID = '1517187722603608'; // app cuenta de prueba
	let REDIRECT_URI =
		'https://sharp-slightly-cardinal.ngrok-free.app/mercado-pago/oauth';

	if (HOST.includes('api.leagueoftoken.online')) {
		REDIRECT_URI = `${HOST}:3443/mercado-pago/oauth`;
	}

	console.log(REDIRECT_URI);

	return (
		<PageLayout title='Wallet'>
			{!wallet && <Loader />}
			{wallet && (
				<Button
					variant='contained'
					color='primary'
					// El state es inseguro
					onClick={() =>
						(window.location.href = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&state=wallet-${wallet.id}&redirect_uri=${REDIRECT_URI}`)
					}
				>
					Autorizar ventas desde MercadoPago para Wallet (Marketplace)
				</Button>
			)}
			<Button
				variant='contained'
				color='primary'
				// El state es inseguro
				onClick={() =>
					(window.location.href = `https://auth.mercadopago.com.ar/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&state=player-${player?.id}&redirect_uri=${REDIRECT_URI}`)
				}
			>
				Autorizar ventas desde MercadoPago para Player
			</Button>
			{wallet && (
				<Stack
					spacing={2}
					sx={{
						mt: '16px',
						width: '100%',
					}}
					justifyContent='center'
				>
					<Typography variant='h6'>Tokens</Typography>
					<TokensList tokens={tokens} />
				</Stack>
			)}

			{wallet && (
				<Stack
					spacing={2}
					sx={{ mt: '16px', width: '100%', maxWidth: '1450px' }}
					justifyContent='center'
				>
					<Typography variant='h6'>Transactions</Typography>
					{transactions && transactions?.length > 0 ? (
						<TableContainer>
							<Table aria-label='a dense table' size='small'>
								<TableHead>
									<TableRow>
										<TableCell align='center'>ID</TableCell>
										<TableCell align='center'>
											Token ID
										</TableCell>
										<TableCell
											align='center'
											sx={{ maxWidth: '80px' }}
										>
											Type
										</TableCell>
										<TableCell
											align='center'
											sx={{ maxWidth: '80px' }}
										>
											Date
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{transactions.map((transaction) => (
										<TableRow
											key={transaction.id}
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
												{transaction.id}
											</TableCell>
											<TableCell align='center'>
												{transaction.token_id}
											</TableCell>
											<TableCell
												align='center'
												sx={{
													color: getColorByTypeId[
														transaction.type
													],
													fontWeight: 'bold',
												}}
											>
												{transaction.type}
											</TableCell>
											<TableCell align='center'>
												{new Date(
													transaction.timestamp
												).toDateString()}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<Typography>There is no transactions yet!</Typography>
					)}
				</Stack>
			)}
		</PageLayout>
	);
};
