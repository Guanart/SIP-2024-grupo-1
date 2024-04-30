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
	const { player, event } = fundraising;

	return (
		<Card sx={{ maxWidth: 345, borderColor: 'secondary' }}>
			<CardMedia
				sx={{ height: 140 }}
				// image = {player.user.avatar}
				image='https://files.bo3.gg/uploads/image/23965/image/webp-655c64b3d990b1f8755b29bf331d8eee.webp'
				title='John Doe'
				// title= {player.user.name}
			/>
			<CardContent>
				<Typography gutterBottom variant='h5' component='h3'>
					{/* {player.user.name} */}
					{event.name}
					John Doe
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
							display: 'inline',
							marginLeft: '6px',
							fontWeight: 'bold',
						}}
					>
						{event.name}
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
						{event.name}
						{/* {event.game.name} */}
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
