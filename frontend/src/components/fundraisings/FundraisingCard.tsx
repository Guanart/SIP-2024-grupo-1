import {
	CardMedia,
	Card,
	Typography,
	CardContent,
	CardActions,
	Button,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Fundraising } from '../../types';

type FundraisingCardProps = {
	showActions?: boolean;
	fundraising: Fundraising;
};

export const FundraisingCard: FunctionComponent<FundraisingCardProps> = ({
	showActions = true,
	fundraising,
}) => {
	const { player } = fundraising;

	return (
		<Card sx={{ maxWidth: 345, width: 345, borderColor: 'secondary' }}>
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
				<Typography variant='body2'>{player.biography}</Typography>
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
			</CardContent>
			{showActions && (
				<CardActions>
					<Button size='small' color='secondary'>
						Share
					</Button>
					<Link to={`/fundraising/${fundraising.id}`}>
						<Button size='small' color='secondary'>
							View details
						</Button>
					</Link>
				</CardActions>
			)}
		</Card>
	);
};
