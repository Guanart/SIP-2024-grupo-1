import {
	Table,
	TableRow,
	TableHead,
	TableCell,
	TableBody,
	TableContainer,
	Stack,
} from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { User, useAuth0 } from '@auth0/auth0-react';
import Typography from '@mui/material/Typography';
import { Token_wallet, Wallet as WalletType } from '../../types';
import { Transaction as TransactionType } from '../../types';
import { useNavigate } from 'react-router-dom';
import { TokensList } from '../../components/wallet/TokensList';
import { Loader } from '../../components';
import './Wallet.css';

export const Wallet = () => {
	const [wallet, setWallet] = useState<WalletType | null>(null);
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
					url: `http://localhost:3000/user/${user?.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();

					if (user.wallet) {
						setTokens(user.wallet.token_wallet);
						setWallet(user.wallet);
						setTransactions(user.wallet.transactions);
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

	// ESTO ES A MODO DE MOCK UP, PROBABLEMENTE HAYA QUE CAMBIARLO
	const getColorByTypeId: { [key: number]: string } = {
		1: '#45FFCA',
		2: 'rgba(147, 11, 11, 0.8)',
	};

	const transactionsType: { [key: number]: string } = {
		1: 'IN',
		2: 'OUT',
	};

	return (
		<PageLayout title='Wallet'>
			{!wallet && <Loader />}

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
														transaction.type_id
													],
													fontWeight: 'bold',
												}}
											>
												{
													transactionsType[
														transaction.type_id
													]
												}
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
						// <List>
						// 	{transactions.map((transaction) => (
						// 		<ListItem
						// 			key={transaction.id}
						// 			sx={{
						// 				backgroundColor: getColorByTypeId(
						// 					transaction.type_id
						// 				),
						// 				borderRadius: '4px', // Establece el radio de las esquinas a 8px
						// 				padding: '12px', // Agrega algo de padding para separarlo de los bordes
						// 				marginBottom: '8px', // Agrega margen inferior entre cada elemento de la lista
						// 			}}
						// 		>
						// 			<ListItemText
						// 				primary={`Token: ${transaction.token_id}`}
						// 				secondary={`Date: ${transaction.timestamp} | Type: ${transaction.type_id}`}
						// 			/>
						// 		</ListItem>
						// 	))}
						// </List>
						<Typography>There is no transactions yet!</Typography>
					)}
				</Stack>
			)}
		</PageLayout>
	);
};
