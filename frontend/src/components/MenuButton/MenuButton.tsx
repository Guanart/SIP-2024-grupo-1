import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export const MenuButton = () => {
	return (
		<IconButton
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
