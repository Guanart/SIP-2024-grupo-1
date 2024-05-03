//import { Button, Stack, TextField } from '@mui/material';
import { Button, Stack, TextField, List, ListItem, ListItemText } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { User, useAuth0 } from '@auth0/auth0-react';
import Typography from '@mui/material/Typography';
import { Wallet as WalletType } from '../../types';
import { Transaction as TransactionType } from '../../types';
import { useNavigate } from 'react-router-dom';
import AddTransactionButton from './AddTransactionButton'; // Importa el componente

export const Wallet = () => {
	const [wallet, setWallet] = useState<WalletType | null>(null);
	const [cbu, setCbu] = useState<string>('');
	const [paypalId, setPaypalId] = useState<string>('');
	const [userId, setUserId] = useState<string>('');
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
					setUserId(user.id);

					if (user.wallet) {
						setWallet(user.wallet);
						setCbu(user.wallet.cbu);
						setPaypalId(user.wallet.paypal_id);
						console.log(user.wallet.transactions)
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

	async function handleCreateWallet() {
		const response = await fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/wallet`,
			method: 'POST',
			data: {
				user_id: userId,
				cbu,
				paypal_id: paypalId,
			},
		});

		if (!response.ok) {
			navigate('/error/500');
		}

		const data = await response.json();
		setWallet(data.wallet);
	}

	async function handleUpdateWallet() {
		const response = await fetchWithAuth({
			isAuthenticated,
			accessToken,
			url: `http://localhost:3000/wallet`,
			method: 'PUT',
			data: {
				wallet_id: wallet?.id,
				cbu,
				paypal_id: paypalId,
			},
		});

		if (!response.ok) {
			navigate('/error/500');
		}

		const data = await response.json();
		setWallet(data.wallet);
	}

	const placeholderTransactions = [
        { id: 1, description: 'Purchase at Store', date: '2024-05-03', amount: '50.00' },
        { id: 2, description: 'Online subscription', date: '2024-05-02', amount: '15.00' },
        { id: 3, description: 'ATM Withdrawal', date: '2024-05-01', amount: '100.00' },
    ];

	return (
		<PageLayout title='Wallet'>
			<Stack direction={{ xs: 'column', md: 'row' }} spacing={8}>
				<Stack
					spacing={2}
					sx={{ mt: '16px', maxWidth: '500px' }}
					justifyContent='center'
				>
					{wallet ? (
						<Typography variant='body2'>
							{JSON.stringify(wallet)}
						</Typography>
					) : (
						<>
							<Typography sx={{ maxWidth: '400px' }}>
								Looks like you haven't created a wallet yet!
								Don't worry, it only takes a few moments to set
								one up
							</Typography>
							<Typography sx={{ maxWidth: '400px' }}>
								Please fill out the form below and click the
								button to create your wallet.
							</Typography>
						</>
					)}
					<TextField
						disabled
						id='user-id'
						value={userId}
						label='User ID'
						sx={{ maxWidth: '400px' }}
					/>
					<TextField
						id='cbu'
						label='CBU'
						type='string'
						value={cbu}
						onChange={(event) => setCbu(event.target.value)}
						inputProps={{ maxLength: 22, minLength: 22 }}
						sx={{ maxWidth: '400px' }}
					/>
					<TextField
						id='paypal_id'
						label='Paypal ID'
						type='string'
						value={paypalId}
						onChange={(event) => setPaypalId(event.target.value)}
						inputProps={{ minLength: 1 }}
						sx={{ maxWidth: '400px' }}
					/>
					{!wallet ? (
						<Button
							variant='contained'
							color='secondary'
							onClick={() => handleCreateWallet()}
							sx={{ maxWidth: '400px' }}
						>
							Create wallet
						</Button>
					) : (
						<Button
							variant='contained'
							color='secondary'
							onClick={() => handleUpdateWallet()}
							sx={{ maxWidth: '400px' }}
						>
							Update wallet
						</Button>
					)}
				</Stack>
                {/* Section to display list of movements/tokens */}
                {wallet && (
                    <Stack spacing={2} sx={{ mt: '16px', maxWidth: '500px' }} justifyContent='center'>
                        <Typography variant='h6'>Transacciones</Typography>
						<AddTransactionButton walletId={wallet.id} />
                        <List>
                            {placeholderTransactions.map((transaction) => (
                                <ListItem key={transaction.id}>
                                    <ListItemText
                                        primary={`Description: ${transaction.description}`}
                                        secondary={`Date: ${transaction.date} | Amount: ${transaction.amount}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Stack>
                )}
			</Stack>
		</PageLayout>
	);
};
