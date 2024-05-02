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
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
						{
							borderColor: '#45FFCA',
						},
					'& .MuiInputLabel-root.Mui-focused': {
						color: '#45FFCA',
					},
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: '#45FFCA',
					},
					'& .MuiInputLabel-root': {
						color: '#45FFCA',
					},
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					'&.Mui-focused': {
						borderColor: '#45FFCA', // Cambiar el color del borde cuando el FormControl está enfocado
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					'&.Mui-focused': {
						color: '#45FFCA', // Cambiar el color del label cuando el FormControl está enfocado
					},
				},
			},
		},
	},
});

export default theme;
