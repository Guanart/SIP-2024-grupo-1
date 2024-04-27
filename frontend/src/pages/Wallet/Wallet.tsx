import { Button, Stack, TextField } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { User, useAuth0 } from '@auth0/auth0-react';
import Typography from '@mui/material/Typography';

export const Wallet = () => {
	const [wallet, setWallet] = useState(null);
	const [cbu, setCbu] = useState<string>('');
	const [paypalId, setPaypalId] = useState<string>('');
	const [userId, setUserId] = useState<string>('');
	const { accessToken } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();

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
					}
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getUserWallet(user);
	}, [accessToken, isAuthenticated, user]);

	async function createWallet() {
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

		const data = await response.json();
		setWallet(data.wallet);
	}

	return (
		<PageLayout title='Wallet'>
			{wallet ? (
				<Typography variant='body2'>
					{JSON.stringify(wallet)}
				</Typography>
			) : (
				<Stack spacing={2} sx={{ mt: '16px' }} justifyContent='center'>
					<Typography sx={{ maxWidth: '400px' }}>
						Looks like you haven't created a wallet yet! Don't
						worry, it only takes a few moments to set one up
					</Typography>
					<Typography sx={{ maxWidth: '400px' }}>
						Please fill out the form below and click the button to
						create your wallet.
					</Typography>
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
					<Button
						variant='contained'
						color='secondary'
						onClick={() => createWallet()}
						sx={{ maxWidth: '400px' }}
					>
						Create wallet
					</Button>
				</Stack>
			)}
		</PageLayout>
	);
};
