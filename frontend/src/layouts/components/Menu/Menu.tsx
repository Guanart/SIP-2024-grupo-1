import { Link } from 'react-router-dom';
import './Menu.css';
import { useState } from 'react';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useAuth0 } from '@auth0/auth0-react';

export const Menu = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated } = useAuth0();

	return (
		<aside>
			<nav>
				<button
					className='menu-button'
					onClick={() => {
						setIsOpen(!isOpen);
					}}
				>
					{isOpen ? (
						<KeyboardDoubleArrowRightIcon />
					) : (
						<KeyboardDoubleArrowLeftIcon />
					)}
				</button>
				<ul className={`menu ${!isOpen ? 'hidden' : ''}`}>
					<li className='menu-item'>
						<Link to='/'>Home</Link>
					</li>
					<li className='menu-item'>
						<Link to='/about'>About</Link>
					</li>
					{isAuthenticated && (
						<li className='menu-item'>
							<Link to='/account'>Account</Link>
						</li>
					)}
					{isAuthenticated && (
						<li className='menu-item'>
							<Link to='/wallet'>My wallet</Link>
						</li>
					)}
					<li className='menu-item'>
						<Link to='/marketplace'>Marketplace</Link>
					</li>
					<li className='menu-item'>
						<Link to='/fundraising'>Fundraising</Link>
					</li>
					<li className='menu-item'>
						<Link to='/trending'>Trending</Link>
					</li>
				</ul>
			</nav>
		</aside>
	);
};
