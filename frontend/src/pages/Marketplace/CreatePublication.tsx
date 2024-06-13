import { PageLayout } from '../../layouts/PageLayout';
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Stack, TextField, Typography, Box } from '@mui/material';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader } from '../../components';
import { KeyboardBackspaceIcon } from '../../global/icons';
import { toast } from 'react-toastify';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const CreatePublication = () => {
	const { token_id } = useParams();
	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [price, setPrice] = useState<number | string>('');
	const [tokenId, setTokenId] = useState<number | string>('');
	const [walletId, setWalletId] = useState<number[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		async function checkPublicationExists() {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/user/${user?.sub}`,
				});

				if (response.ok) {
					const { user } = await response.json();
					setWalletId(user.wallet.id);
					setTokenId(Number(token_id));

					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `${HOST}:${PORT}/marketplace/token/${token_id}`,
					});

					if (response.ok) {
						const { publication } = await response.json();
						navigate(
							`/marketplace/publication/${publication.publication_id}`
						);
					}
				}
			} catch (error) {
				setIsLoading(false);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		checkPublicationExists();
	}, [accessToken, isAuthenticated, user, navigate, token_id]);

	if (isLoading) {
		return (
			<PageLayout title='Create marketplace publication'>
				<Link to={`/wallet/${walletId}`}>
					<Button size='small' color='secondary'>
						<KeyboardBackspaceIcon
							sx={{ marginRight: '4px', marginY: '16px' }}
						/>{' '}
						Back
					</Button>
				</Link>
				<Loader />
			</PageLayout>
		);
	}

	async function handleCreatePublication(event: FormEvent) {
		event.preventDefault();
		const marketplacePublication = {
			price: Number(price),
			token_id: Number(tokenId),
			out_wallet_id: Number(walletId),
		};
		try {
			const response = await fetchWithAuth({
				isAuthenticated,
				accessToken,
				url: `${HOST}:${PORT}/marketplace`,
				method: 'POST',
				data: marketplacePublication,
			});

			if (response.ok) {
				const { publication } = await response.json();
				navigate(
					`/marketplace/publication/${publication.publication_id}`
				);
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

	return (
		<PageLayout title='Create marketplace publication'>
			<Stack
				direction={{ sx: 'column', md: 'row' }}
				spacing={{ sx: 4, md: 12 }}
			>
				<img
					style={{
						marginTop: '12px',
						marginBottom: '24px',
						maxWidth: '300px',
					}}
					src='/assets/images/create-publication.png'
					alt='Valorant character'
				/>
				<Box
					sx={{
						display: 'flex',
						gap: '16px',
						flexDirection: 'column',
					}}
				>
					<Typography
						variant='h6'
						color='secondary'
						sx={{ maxWidth: '500px' }}
					>
						Publish your token on our secure marketplace
					</Typography>
					<form
						onSubmit={(event) => handleCreatePublication(event)}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '16px',
							minWidth: '300px',
							marginTop: '8px',
							...(window.innerWidth <= 900 && {
								marginTop: '0px', // Cambiar el marginTop para pantallas pequeñas
							}),
						}}
					>
						<TextField
							id='publication-token-id'
							value={tokenId}
							label='Token ID'
							sx={{ maxWidth: '500px', width: '90%' }}
							disabled={true}
						/>
						<TextField
							id='publication-wallet-id'
							value={walletId}
							label='Your wallet ID'
							sx={{ maxWidth: '500px', width: '90%' }}
							type='number'
							disabled={true}
						/>
						<TextField
							id='publication-price'
							value={price}
							label='Price'
							sx={{ maxWidth: '500px', width: '90%' }}
							type='number'
							onChange={(event) => {
								const value = Number(event.target.value);
								if (value < 0) {
									setPrice(0);
								} else {
									setPrice(event.target.value);
								}
							}}
						/>
						<Button
							variant='contained'
							color='secondary'
							type='submit'
							disabled={!price || price === '0'}
							sx={{ maxWidth: '500px', width: '90%' }}
						>
							Create publication
						</Button>
					</form>
				</Box>
			</Stack>
		</PageLayout>
	);
};
