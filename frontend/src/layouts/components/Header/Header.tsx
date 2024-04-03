import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, LogoutButton, SignupButton } from '../../../components';

export const Header = () => {
	const { isAuthenticated } = useAuth0();
	return (
		<header>
			<h1>LOT</h1>
			<nav className='header-nav'>
				<ul>
					<li className='nav-item'>
						<Link to='/'>Home</Link>
					</li>
					<li className='nav-item'>
						<Link to='/about'>About</Link>
					</li>
					{isAuthenticated && (
						<li className='nav-item'>
							<Link to='/account'>Account</Link>
						</li>
					)}
					<li className='nav-item'>
						{isAuthenticated ? (
							<LogoutButton />
						) : (
							<>
								<LoginButton />
								<SignupButton />
							</>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
};
