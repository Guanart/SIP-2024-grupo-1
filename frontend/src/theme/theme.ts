import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';

export const theme: ThemeOptions = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#40128B',
		},
		secondary: {
			main: '#9336B4',
		},
	},
});

export default theme;
