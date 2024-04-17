import { FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './Menu.css';
import {
	Drawer,
	Box,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import {
	InfoIcon,
	AccountCircleIcon,
	WalletIcon,
	TokenIcon,
	EmojiEventsIcon,
	HomeIcon,
	TrendingUpIcon,
} from '../../../global/icons';
import { Link } from 'react-router-dom';

const items = [
	{ text: 'Home', href: '/', icon: <HomeIcon />, isProtected: false },
	{
		text: 'About',
		href: '/about',
		icon: <InfoIcon />,
		isProtected: false,
	},
	{
		text: 'Account',
		href: '/account',
		icon: <AccountCircleIcon />,
		isProtected: true,
	},
	{
		text: 'Wallet',
		href: '/wallet',
		icon: <WalletIcon />,
		isProtected: true,
	},
	{
		text: 'Marketplace',
		href: '/marketplace',
		icon: <TokenIcon />,
		isProtected: false,
	},
	{
		text: 'Fundraising',
		href: '/fundraising',
		icon: <EmojiEventsIcon />,
		isProtected: false,
	},
	{
		text: 'Trending',
		href: '/trending',
		icon: <TrendingUpIcon />,
		isProtected: false,
	},
];

type MenuProps = {
	isOpen: boolean;
	toggleMenu: () => void;
};

export const Menu: FunctionComponent<MenuProps> = ({ isOpen, toggleMenu }) => {
	const { isAuthenticated } = useAuth0();

	return (
		<Drawer anchor='left' open={isOpen} onClose={toggleMenu}>
			<Box sx={{ width: 250 }} role='presentation' onClick={toggleMenu}>
				<List>
					{items.map(({ text, href, icon, isProtected }) => {
						return !isProtected ? (
							<Link
								to={href}
								style={{
									textDecoration: 'none',
									color: 'inherit',
								}}
								key={text}
							>
								<ListItem disablePadding>
									<ListItemButton>
										<ListItemIcon>{icon}</ListItemIcon>
										<ListItemText primary={text} />
									</ListItemButton>
								</ListItem>
							</Link>
						) : (
							isAuthenticated && (
								<Link
									to={href}
									style={{
										textDecoration: 'none',
										color: 'inherit',
									}}
									key={text}
								>
									<ListItem key={text} disablePadding>
										<ListItemButton>
											<ListItemIcon>{icon}</ListItemIcon>
											<ListItemText primary={text} />
										</ListItemButton>
									</ListItem>
								</Link>
							)
						);
					})}
				</List>
			</Box>
		</Drawer>
	);
};
