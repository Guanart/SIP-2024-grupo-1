import {
	Avatar,
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Token, Token_wallet } from '../../types';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, useAuth0 } from '@auth0/auth0-react';
import { CurrencyExchangeIcon, DoubleArrowIcon } from '../../global/icons';
import { toast } from 'react-toastify';

export const MostValuableTokensList = () => {
	const [tokens, setTokens] = useState<Token[]>([]);
	const { accessToken } = useAccessToken();
	const { user, isAuthenticated } = useAuth0();
	const navigate = useNavigate();
	const { auth0_id } = useParams();

	useEffect(() => {
		async function getUserMostValuableTokens(user: User) {
			try {
				let response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/user/${user.sub}`,
				});

				if (response.ok) {
					response = await fetchWithAuth({
						isAuthenticated,
						accessToken,
						url: `http://localhost:3000/token/valuable/${auth0_id}`,
					});

					if (response.ok) {
						const { tokens } = await response.json();
						const mostValuableTokens = tokens.map(
							(token_wallet: Token_wallet) => token_wallet.token
						);

						setTokens(mostValuableTokens);
					} else {
						navigate('/error/500');
					}
				} else {
					navigate('/error/500');
				}
			} catch (error) {
				console.log(error);
				navigate('/error/500');
			}
		}

		if (!user) return;
		if (!accessToken) return;

		getUserMostValuableTokens(user);
	}, [accessToken, isAuthenticated, user, navigate, auth0_id]);

	if (tokens.length === 0) {
		return (
			<>
				<Typography component='p' sx={{ paddingTop: '16px' }}>
					You don't have any tokens yet!
				</Typography>
				<Link
					to={`/fundraisings`}
					style={{
						textDecoration: 'none',
						color: '#45FFCA',
						padding: '16px 0',
						fontWeight: 'bold',
					}}
				>
					Buy tokens
				</Link>
			</>
		);
	}

	return (
		<List sx={{ width: '100%', maxWidth: 360 }}>
			{tokens.map((token) => (
				<ListItem key={token.id}>
					<ListItemAvatar>
						<Avatar
							sx={{
								background: 'transparent',
								height: '50px',
								width: '50px',
							}}
							src={`${token.collection.fundraising.player.user.avatar}`}
							alt={`${token.collection.fundraising.player.user.avatar}`}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={`${token.collection.fundraising.player.user.username} | ${token.collection.fundraising.event.name}`}
						secondary={`ID: ${token.id} | U$D ${token.price}`}
						primaryTypographyProps={{
							fontWeight: 'bold',
							marginLeft: '2px',
							color: 'white',
						}}
						secondaryTypographyProps={{
							color: 'secondary',
							fontWeight: 'bold',
							marginLeft: '2px',
						}}
					/>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						{token.collection.fundraising.active ? (
							<Link
								to={`/fundraising/${token.collection.fundraising.id}`}
								style={{
									textDecoration: 'none',
									color: '#45FFCA',
								}}
							>
								<DoubleArrowIcon sx={{ fontSize: '1.3rem' }} />
							</Link>
						) : (
							<DoubleArrowIcon
								onClick={() =>
									toast.error(
										'The fundraising associated with the token has ended.'
									)
								}
								color='secondary'
								sx={{ fontSize: '1.3rem', cursor: 'pointer' }}
							/>
						)}
						{!token.collection.fundraising.event.checked ? (
							<Link
								to={`/marketplace/publication/create/${token.id}`}
								style={{
									textDecoration: 'none',
									color: '#45FFCA',
								}}
							>
								<CurrencyExchangeIcon
									sx={{ fontSize: '1.3rem' }}
								/>
							</Link>
						) : (
							<CurrencyExchangeIcon
								onClick={() =>
									toast.error(
										'You cannot sell tokens of an event that has ended.'
									)
								}
								color='secondary'
								sx={{ fontSize: '1.3rem', cursor: 'pointer' }}
							/>
						)}
					</Box>
				</ListItem>
			))}
			<Link
				to={`/wallet`}
				style={{
					textDecoration: 'none',
					color: '#45FFCA',
					padding: '16px 0',
				}}
			>
				See all your tokens
			</Link>
		</List>
	);
};
