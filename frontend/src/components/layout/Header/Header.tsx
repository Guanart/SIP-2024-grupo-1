import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Stack, Avatar } from '@mui/material';
import { LoginButton, LogoutButton, SignupButton, MenuButton } from '../..';
import { User, useAuth0 } from '@auth0/auth0-react';
import { Menu } from '../Menu/Menu';
import './Header.css';
import { fetchWithAuth } from '../../../utils/fetchWithAuth';
import { useAccessToken } from '../../../hooks';
import { Link } from 'react-router-dom';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export function Header() {
	const { isAuthenticated, user } = useAuth0();
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [avatar, setAvatar] = useState<string | undefined>('');
	const { accessToken } = useAccessToken();

	useEffect(() => {
		// Verifica si el usuario logueado ya está dado de alta en la API. Caso contrario, envía petición para darlo de alta (es nuevo usuario)
		async function readUserStatus(user: User) {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `${HOST}:${PORT}/user/${user.sub}`,
				});

				const data = await response.json();
				setAvatar(data.user.avatar);
			} catch (error) {
				setAvatar(user?.picture);
			}
		}

		if (!user) return;
		if (!accessToken) return;

		readUserStatus(user);
	}, [accessToken, user, isAuthenticated]);

	function toggleMenu() {
		setIsMenuOpen(!isMenuOpen);
	}

	return (
		<AppBar position='fixed' sx={{ width: '100%' }}>
			<Menu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
			<Toolbar>
				<MenuButton toggleMenu={toggleMenu} />
				<Typography variant='h1' component='h1' sx={{ flexGrow: 1 }}>
					<Link to={`/`}>
						<img
							src='/assets/logo.png'
							alt='LOT'
							className='logo'
						/>
					</Link>
				</Typography>

				<Stack direction='row' spacing={1.5}>
					{isAuthenticated ? (
						<>
							<Link to={`/account/${user?.sub}`}>
								<Avatar alt={user?.name} src={avatar} />
							</Link>
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
