import {
	CardMedia,
	Card,
	Typography,
	CardContent,
	CardActions,
	Button,
	Avatar,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { MarketplacePublication } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';

type MarketplaceCardProps = {
	publication: MarketplacePublication;
};

export const MarketplaceCard: FunctionComponent<MarketplaceCardProps> = ({
	publication,
}) => {
	const { user } = useAuth0();
	const player = publication.token.collection.fundraising.player;
	const seller = publication.out_wallet.user;
	const fundraising = publication.token.collection.fundraising;

	return (
		<Card
			sx={{
				maxWidth: 345,
				width: 345,
				borderColor: 'secondary',
			}}
		>
			<CardContent
				sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
			>
				<Avatar src={seller?.avatar} sx={{ display: 'inline-block' }} />
				<Typography component='div'>
					<Typography>{seller?.username}</Typography>
					<Typography variant='body2'>
						{new Date(publication.date).toUTCString()}
					</Typography>
				</Typography>
			</CardContent>
			<CardMedia
				sx={{ height: 140 }}
				image={player.user.avatar}
				title={player.user.username}
			/>
			<CardContent
				sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
			>
				<Typography gutterBottom variant='h5' component='h3'>
					{player.user.username}
				</Typography>
				<Typography component='div' sx={{ marginTop: '8px' }}>
					Ranking
					<Typography
						color='secondary'
						component='div'
						sx={{
							display: 'inline',
							marginLeft: '6px',
							fontWeight: 'bold',
						}}
					>
						{player.ranking}
					</Typography>
				</Typography>
				<Typography component='div'>
					Game
					<Typography
						color='secondary'
						component='div'
						sx={{
							display: 'inline-flex',
							marginLeft: '6px',
							fontWeight: 'bold',
							alignItems: 'center',
							gap: '8px',
						}}
					>
						{fundraising.player.game.name}
						<img
							style={{ display: 'inline' }}
							width='35px'
							height='25px'
							src={fundraising.player.game.icon}
							alt={`${fundraising.player.game.name} icon`}
						/>
					</Typography>
				</Typography>
				<Typography component='div'>
					Event
					<Typography
						color='secondary'
						component='div'
						sx={{
							display: 'inline',
							marginLeft: '6px',
							fontWeight: 'bold',
						}}
					>
						{fundraising.event.name}
					</Typography>
				</Typography>
				<Typography component='div'>
					Revenue
					<Typography
						color='secondary'
						component='div'
						sx={{
							display: 'inline',
							marginLeft: '6px',
							fontWeight: 'bold',
						}}
					>
						Max. U$D{' '}
						{fundraising.event.prize *
							(fundraising.prize_percentage / 100) *
							publication.token.collection.token_prize_percentage}
					</Typography>
				</Typography>
				<Typography component='div'>
					Price
					<Typography
						color='secondary'
						component='div'
						sx={{
							display: 'inline',
							marginLeft: '6px',
							fontWeight: 'bold',
						}}
					>
						U$D {publication.price}
					</Typography>
				</Typography>
			</CardContent>

			<CardActions sx={{ position: 'relative' }}>
				<Link
					to={`/marketplace/publication/${publication.publication_id}`}
				>
					{user?.sub !== publication.out_wallet.user?.auth0_id ? (
						<Button
							variant='contained'
							color='secondary'
							sx={{
								position: 'absolute',
								right: '16px',
								bottom: '16px',
							}}
						>
							Buy now
						</Button>
					) : (
						<Button
							color='secondary'
							sx={{
								position: 'absolute',
								right: '16px',
								bottom: '16px',
							}}
						>
							View details
						</Button>
					)}
				</Link>
			</CardActions>
		</Card>
	);
};
