import {
	Avatar,
	Box,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { Token_wallet } from '../../types';
import { Link } from 'react-router-dom';
import { CurrencyExchangeIcon, DoubleArrowIcon } from '../../global/icons';

type TokensListProps = {
	tokens: Token_wallet[];
};

export const TokensList: FunctionComponent<TokensListProps> = ({ tokens }) => {
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
		<List
			sx={{
				width: '100%',
				display: 'flex',
				flexWrap: 'wrap',
				gap: '24px',
			}}
		>
			{tokens.map((token_data) => (
				<ListItem key={token_data.token_id} sx={{ maxWidth: '340px' }}>
					<ListItemAvatar>
						<Avatar
							sx={{
								background: 'transparent',
								height: '50px',
								width: '50px',
							}}
							src={`${token_data.token.collection.fundraising.player.user.avatar}`}
							alt={`${token_data.token.collection.fundraising.player.user.avatar}`}
						/>
					</ListItemAvatar>
					<ListItemText
						primary={`${token_data.token.collection.fundraising.player.user.username} | ${token_data.token.collection.fundraising.event.name}`}
						secondary={`ID: ${token_data.token_id} | U$D ${token_data.token.price}`}
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
						<Link
							to={`/fundraising/${token_data.token.collection.fundraising.id}`}
							style={{
								textDecoration: 'none',
								color: '#45FFCA',
							}}
						>
							<DoubleArrowIcon sx={{ fontSize: '1.3rem' }} />
						</Link>
						<Link
							to={`/marketplace/publication/create/${token_data.token.id}`}
							style={{
								textDecoration: 'none',
								color: '#45FFCA',
							}}
						>
							<CurrencyExchangeIcon sx={{ fontSize: '1.3rem' }} />
						</Link>
					</Box>
				</ListItem>
			))}
		</List>
	);
};
