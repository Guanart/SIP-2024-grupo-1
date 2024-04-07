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
				{/* Acá debería ir el logo de LOT */}
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
					LOT
				</Typography>
				<Stack direction='row' spacing={2}>
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
