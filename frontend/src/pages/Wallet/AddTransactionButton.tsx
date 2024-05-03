import { useState } from 'react';
import { Button } from '@mui/material';
import { fetchWithAuth } from '../../utils/fetchWithAuth'; // Importa la función de fetch con autenticación
import { useAccessToken } from '../../hooks';

type AddTransactionButtonProps = {
    walletId: number; // Especifica el tipo de `walletId` como `number`
};

const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ walletId }) => {
    const { accessToken } = useAccessToken(); // Obtener el token de acceso
    const [transaction, setTransaction] = useState<any>(null); // Si tienes un tipo definido para transacciones, cámbialo aquí.

    const handleAddTransaction = async () => {
        // Prepara los datos de la transacción
        const newTransaction = {
            wallet_id: walletId,
            amount: 100.0, // Por ejemplo, el monto de la transacción
            type_id: 1, // Tipo de transacción (ajusta según sea necesario)
            token_id: 2, // ID del token (ajusta según sea necesario)
            timestamp: new Date().toISOString(),
            // Agrega otros campos necesarios
        };

        // Realizar la solicitud POST para crear la transacción
        const response = await fetchWithAuth({
            isAuthenticated: true,
            accessToken,
            url: 'http://localhost:3000/transactions', // Endpoint de tu backend para crear transacciones
            method: 'POST',
            data: {
                wallet_id: newTransaction.wallet_id,
                amount: newTransaction.amount,
                type_id: newTransaction.type_id,
                token_id: newTransaction.token_id,
                timestamp: newTransaction.timestamp,
            },
        });

        // Manejar la respuesta
        if (response.ok) {
            const data = await response.json();
            // Actualiza el estado con la nueva transacción creada
            setTransaction(data);
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