import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
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
					<li className='nav-item'>
						<Link to='/account'>Account</Link>
					</li>
					<li className='nav-item'>
						<button className='auth-button'>Log in</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};
