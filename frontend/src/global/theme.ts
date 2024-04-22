import { createTheme } from '@mui/material/styles';
import { ThemeOptions } from '@mui/material/styles';

export const theme: ThemeOptions = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#272727',
		},
		secondary: {
			main: '#45FFCA',
		},
		text: {
			primary: '#fff',
			secondary: 'rgba(255, 255, 255, 0.7)',
			disabled: 'rgba(255, 255, 255, 0.5)',
		},
	},
	typography: {
		allVariants: {
			color: '#fff',
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
