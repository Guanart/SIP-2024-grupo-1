import { Button } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { useState } from 'react';

export const Wallet = () => {
	const [wallet, setWallet] = useState(null);

	useState(() => {
		//TODO: Verificar si tiene wallet.
		//TODO: Si no tiene wallet, mostrar botón para crearla.
	}, []);

	async function createWallet() {
		console.log('Creando wallet...');
	}

	return (
		<PageLayout title='Wallet'>
			<Button
				variant='contained'
				className='login-button'
				color='secondary'
				sx={{
					fontWeight: 'bold',
				}}
				onClick={() => createWallet()}
			>
				Create wallet
			</Button>
		</PageLayout>
	);
};
