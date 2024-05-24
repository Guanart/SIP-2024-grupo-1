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
} from '../../../global/icons';
import { Link } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useAccessToken } from '../../../hooks';

type MenuProps = {
	isOpen: boolean;
	toggleMenu: () => void;
};

export const Menu: FunctionComponent<MenuProps> = ({ isOpen, toggleMenu }) => {
	const { isAuthenticated, user } = useAuth0();
	const { role } = useAccessToken();

	const items = [
		{
			text: 'Home',
			href: '/',
			icon: <HomeIcon />,
			isProtected: false,
			allowed: [],
		},
		{
			text: 'Help',
			href: '/help',
			icon: <InfoIcon />,
			isProtected: false,
			allowed: [],
		},
		{
			text: 'Account',
			href: `/account/${user?.sub}`,
			icon: <AccountCircleIcon />,
			isProtected: true,
			allowed: ['user', 'player', 'admin'],
		},
		{
			text: 'Wallet',
			href: '/wallet',
			icon: <WalletIcon />,
			isProtected: true,
			allowed: ['user', 'player'],
		},
		{
			text: 'Marketplace',
			href: '/marketplace',
			icon: <TokenIcon />,
			isProtected: false,
			allowed: [],
		},
		{
			text: 'Fundraisings',
			href: '/fundraisings',
			icon: <EmojiEventsIcon />,
			isProtected: false,
			allowed: [],
		},
		{
			text: 'Player Request',
			href: '/sendPlayerRequest',
			icon: <AssignmentTurnedInIcon />,
			isProtected: true,
			allowed: ['user'],
		},
		{
			text: 'Administration',
			href: '/administration',
			icon: <AssignmentTurnedInIcon />,
			isProtected: true,
			allowed: ['admin'],
		},
	];

	return (
		<Drawer anchor='left' open={isOpen} onClose={toggleMenu}>
			<Box sx={{ width: 250 }} role='presentation' onClick={toggleMenu}>
				<List>
					{items.map(({ text, href, icon, isProtected, allowed }) => {
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
							isAuthenticated && allowed.indexOf(role) > -1 && (
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
