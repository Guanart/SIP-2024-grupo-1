import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {
	LoginButton,
	LogoutButton,
	SignupButton,
	ImageAvatar,
	MenuButton,
} from '../../../components';
import { useAuth0 } from '@auth0/auth0-react';
import './Header.css';

export function Header() {
	const { isAuthenticated } = useAuth0();

	return (
		<AppBar position='fixed'>
			<Toolbar>
				<MenuButton />
				<Typography variant='h1' component='h1' sx={{ flexGrow: 1 }}>
					<img src='logo.png' alt='LOT' className='logo' />
				</Typography>

				<Stack direction='row' spacing={1.5}>
					{isAuthenticated ? (
						<>
							<ImageAvatar />
							<LogoutButton />
						</>
					) : (
						<>
							<LoginButton />
							<SignupButton />
						</>
					)}
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
