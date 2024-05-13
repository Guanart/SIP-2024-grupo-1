import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLayout } from '../../layouts/PageLayout';
import {
	Stack,
	Button,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAccessToken } from '../../hooks';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import './RequestForm.css';
import { Game } from '../../types';

export const RequestForm = () => {
	const { accessToken } = useAccessToken();
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const navigate = useNavigate();
	const [game, setGame] = useState('');
	const [rank, setRank] = useState('');
	const [games, setGames] = useState<Game[]>([]);
	const [ranks, setRanks] = useState([]);
	const [selectedGame, setSelectedGame] = useState('');
	const [selectedRank, setSelectedRank] = useState('');
	const { user, isAuthenticated } = useAuth0();

	const isMediumScreen = useMediaQuery('(min-width: 600px)'); // Definir el breakpoint en 600px

	useEffect(() => {
		async function getGames() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/game`,
				});
				if (response.ok) {
					const { games } = await response.json();
					console.log(game);
					setGames(games);
				}
			} catch (error) {
				console.log(error);
			}
		}
		async function getRanks() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://localhost:3000/rank`,
				});
				if (response.ok) {
					const { ranks } = await response.json();
					console.log(rank);
					setRanks(ranks);
				}
			} catch (error) {
				console.log(error);
			}
		}
		if (!user) return;
		if (!accessToken) return;
		getGames();
		getRanks();
	}, [accessToken, isAuthenticated, user]);

	useEffect(() => {
		console.log(games);
	}, [games]);

	/*
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Evento onChange activado");
        const { name, files } = event.target;
        if (name === 'pdfFile' && files && files.length > 0) {
            const selectedFile = files[0];
            setPdfFile(selectedFile);
            console.log("Archivo seleccionado:", selectedFile.name);
        } else if (name === 'selectedGame') {
            setSelectedGame(event.target.value);
        } else if (name === 'selectedRank') {
            setSelectedRank(event.target.value);
        }
    }
    */

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const selectedFile = files[0];
			setPdfFile(selectedFile);
			console.log('Archivo seleccionado:', selectedFile.name);
		}
	};

	// Manejador de envío del formulario
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Crea un objeto FormData para enviar los datos del formulario
		const formData = new FormData();
		formData.append('game', game);
		formData.append('rank', rank);

		// Verifica si pdfFile es diferente de null antes de agregarlo a FormData
		if (pdfFile) {
			formData.append('document', pdfFile);
		}

		try {
			// Realiza la solicitud POST al backend
			const response = await fetchWithAuth({
				isAuthenticated: true,
				accessToken,
				url: `http://localhost:3000/verification-request`, // Reemplaza con la URL de tu API
				method: 'POST',
				data: formData,
			});

			if (response.ok) {
				// Manejar respuesta de éxito
				console.log('Formulario enviado con éxito.');
				// Redireccionar a otra página si es necesario
				navigate('/success');
			} else {
				// Manejar errores
				console.error(
					'Error al enviar el formulario:',
					response.statusText
				);
				navigate('/error/500');
			}
		} catch (error) {
			console.error('Error al enviar la solicitud:', error);
			navigate('/error/500');
		}
	};

	const handleSelectChange = (
		event: SelectChangeEvent<string>,
		name: string
	) => {
		const value = event.target.value;
		if (name === 'game') {
			setGame(value);
		} else if (name === 'rank') {
			setRank(value);
		}
	};

	return (
		<PageLayout title='requestForm '>
			<Box className='requestFormBackground'>
				<Box className='form-container'>
					<Typography
						variant={isMediumScreen ? 'h2' : 'h3'}
						component='h2'
						color='secondary'
						fontWeight={500}
						textAlign='center'
						fontFamily='Orbitron, sans-serif'
						px={2}
					>
						Join the Pros!
					</Typography>
					<Typography sx={{ maxWidth: '500px' }}>
						{/*JSON.stringify(wallet)*/}
						Para el proceso de verificacion de jugadores,
						necesitamos algun tipo de documentacion. Una vez
						registrada su solicitud, nuestros administradores la
						verificaran lo antes posible!
					</Typography>
					<form onSubmit={handleSubmit}>
						<Stack spacing={2}>
							{/* Lista desplegable para seleccionar el rango */}
							<FormControl fullWidth>
								<InputLabel id='rank-label'>Rango</InputLabel>
								<Select
									labelId='rank-label'
									id='rank-select'
									value={rank}
									onChange={(event) =>
										handleSelectChange(event, 'rank')
									}
									required
									fullWidth
								>
									{ranks.length > 0 ? (
										ranks.map((rankItem, index) => (
											<MenuItem
												key={index}
												value={rankItem}
											>
												{rankItem}
											</MenuItem>
										))
									) : (
										<MenuItem disabled>
											No hay rangos disponibles por el
											momento
										</MenuItem>
									)}
								</Select>
							</FormControl>

							{/* Lista desplegable para seleccionar el juego */}
							<FormControl fullWidth>
								<InputLabel id='game-label'>Juego</InputLabel>
								<Select
									labelId='game-label'
									id='game-select'
									value={game}
									onChange={(event) =>
										handleSelectChange(event, 'game')
									}
									required
									fullWidth
								>
									{games.length > 0 ? (
										games.map((gameItem, index) => (
											<MenuItem
												key={index}
												value={gameItem.id}
											>
												{gameItem.name}
											</MenuItem>
										))
									) : (
										<MenuItem disabled>
											No hay juegos disponibles por el
											momento
										</MenuItem>
									)}
								</Select>
							</FormControl>

							{/* Campo de entrada para el archivo PDF */}
							<Stack
								direction='row'
								spacing={1}
								alignItems='center'
							>
								<input
									type='file'
									id='pdf-file-upload'
									style={{ display: 'none' }}
									accept='application/pdf'
									onChange={(event) =>
										handleFileChange(event)
									}
								/>
								<label htmlFor='pdf-file-upload'>
									<input
										type='file'
										id='pdf-file-upload'
										style={{ display: 'none' }}
										accept='application/pdf'
										//onChange={(event) => handleInputChange(event)}
									/>
									<Button
										variant='contained'
										component='span'
										color='secondary'
									>
										Subir PDF
									</Button>
								</label>
								<span>
									{pdfFile
										? pdfFile.name
										: 'No se ha seleccionado ningún archivo'}
								</span>
							</Stack>

							{/* Botón de envío del formulario */}
							<Button
								type='submit'
								variant='contained'
								color='secondary'
							>
								Enviar
							</Button>
						</Stack>
					</form>
				</Box>
			</Box>
		</PageLayout>
	);
};
