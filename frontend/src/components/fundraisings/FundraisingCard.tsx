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

type FundraisingCardProps = {
	showActions?: boolean;
};

export const FundraisingCard: FunctionComponent<FundraisingCardProps> = ({
	showActions = true,
}) => {
	return (
		<Card sx={{ maxWidth: 345, borderColor: 'secondary' }}>
			<CardMedia
				sx={{ height: 140 }}
				image='https://files.bo3.gg/uploads/image/23965/image/webp-655c64b3d990b1f8755b29bf331d8eee.webp'
				title='John Doe'
			/>
			<CardContent>
				<Typography gutterBottom variant='h5' component='h3'>
					John Doe{' '}
				</Typography>
				<Typography variant='body2'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					Vestibulum ante ipsum primis in faucibus orci luctus et
					ultrices posuere cubilia Curae; Sed consectetur arcu non
					libero'
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
						10
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
						Valorant
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
						Supermagic
					</Typography>
				</Typography>
			</CardContent>
			{showActions && (
				<CardActions>
					<Button size='small' color='secondary'>
						Share
					</Button>
					<Link to='/fundraising/1'>
						<Button size='small' color='secondary'>
							View details
						</Button>
					</Link>
				</CardActions>
			)}
		</Card>
	);
};
