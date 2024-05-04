//import { useState } from 'react';
import { Button } from '@mui/material';
import { fetchWithAuth } from '../../utils/fetchWithAuth'; // Importa la función de fetch con autenticación
import { useAccessToken } from '../../hooks';

type AddTransactionButtonProps = {
    walletId: number; // Especifica el tipo de `walletId` como `number`
};

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ walletId }) => {
    const { accessToken } = useAccessToken(); // Obtener el token de acceso
    //const [transaction, setTransaction] = useState<any>(null); // Si tienes un tipo definido para transacciones, cámbialo aquí.

    const handleAddTransaction = async () => {
        // Realizar la solicitud POST para crear la transacción
        const response = await fetchWithAuth({
            isAuthenticated: true,
            accessToken,
            url: 'http://localhost:3000/transaction', // Endpoint de tu backend para crear transacciones
            method: 'POST',
            data: {
                wallet_id: walletId,
                type_id: 1,
                token_id: 2,
                timestamp: new Date().toISOString(),
            },
        });
        console.log(response);
        // Manejar la respuesta
        if (response.ok) {
            const data = await response.json();
            // Actualiza el estado con la nueva transacción creada
            //setTransaction(data);
            console.log('Nueva transacción creada:', data);
        } else {
            console.error('Error al crear la transacción');
        }
    };

    return (
        <Button 
            variant='contained'
            color='secondary'
            sx={{ maxWidth: '400px' }}
            onClick={handleAddTransaction}>
            Añadir Transacción
        </Button>
    );
};

export default AddTransactionButton;