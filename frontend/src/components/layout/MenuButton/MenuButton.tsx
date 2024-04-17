import IconButton from '@mui/material/IconButton';
import { MenuIcon } from '../../../global/icons';
import { FunctionComponent } from 'react';

type MenuButtonProps = {
	toggleMenu: () => void;
};

export const MenuButton: FunctionComponent<MenuButtonProps> = ({
	toggleMenu,
}) => {
	return (
		<IconButton
			onClick={toggleMenu}
			size='large'
			edge='start'
			color='inherit'
			aria-label='menu'
			sx={{ mr: 0.5 }}
		>
			<MenuIcon />
		</IconButton>
	);
};
