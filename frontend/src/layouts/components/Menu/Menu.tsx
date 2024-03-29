import { Link } from 'react-router-dom';
import './Menu.css';
import { useState } from 'react';
import { CaretDoubleLeft, CaretDoubleRight } from '@phosphor-icons/react';
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
						<CaretDoubleRight size={18} weight='bold' />
					) : (
						<CaretDoubleLeft size={18} weight='bold' />
					)}
				</button>
				<ul className={`menu ${!isOpen ? 'hidden' : ''}`}>
					<li className='menu-item'>
						<Link to='/marketplace'>Marketplace</Link>
					</li>
					<li className='menu-item'>
						<Link to='/fundraising'>Fundraising</Link>
					</li>
					<li className='menu-item'>
						<Link to='/trending'>Trending</Link>
					</li>
					{isAuthenticated && (
						<li className='menu-item'>
							<Link to='/wallet'>My wallet</Link>
						</li>
					)}
				</ul>
			</nav>
		</aside>
	);
};
