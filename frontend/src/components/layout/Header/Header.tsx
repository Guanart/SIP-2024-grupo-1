import { useState } from 'react';
import { AppBar, Toolbar, Typography, Stack, Avatar } from '@mui/material';
import { LoginButton, LogoutButton, SignupButton, MenuButton } from '../..';
import { useAuth0 } from '@auth0/auth0-react';
import { Menu } from '../Menu/Menu';
import './Header.css';

export function Header() {
	const { isAuthenticated, user } = useAuth0();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	function toggleMenu() {
		setIsMenuOpen(!isMenuOpen);
	}

	return (
		<AppBar position='fixed'>
			<Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
			<Toolbar>
				<MenuButton toggleMenu={toggleMenu} />
				<Typography variant='h1' component='h1' sx={{ flexGrow: 1 }}>
					<img src='/assets/logo.png' alt='LOT' className='logo' />
				</Typography>

				<Stack direction='row' spacing={1.5}>
					{isAuthenticated ? (
						<>
							<Avatar alt={user?.name} src={user?.picture} />;
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
