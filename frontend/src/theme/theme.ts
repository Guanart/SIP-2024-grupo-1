import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';

export const theme: ThemeOptions = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#211951',
		},
		secondary: {
			main: '#45FFCA',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				outlined: {
					borderWidth: '2px',
				},
			},
		},
	},
});

export default theme;
