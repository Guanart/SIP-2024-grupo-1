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
import useMediaQuery from '@mui/material/useMediaQuery';
import './RequestForm.css';
import { Game } from '../../types';
import { Rank } from '../../types';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const RequestForm = () => {
	const [userId, setUserId] = useState<string>('');

	//const [gameId, setGameId] = useState<string>('');
	//const [rankId, setRankId] = useState('');

	const [games, setGames] = useState<Game[]>([]);
	const [ranks, setRanks] = useState<Rank[]>([]);

	const [selectedGame, setSelectedGame] = useState<Game | null>(
		games.length > 0 ? games[0] : null
	);
	const [selectedRank, setSelectedRank] = useState<Rank | null>(
		ranks.length > 0 ? ranks[0] : null
	);

	const { user, isAuthenticated } = useAuth0();
	const { accessToken } = useAccessToken();
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const navigate = useNavigate();

	const isMediumScreen = useMediaQuery('(min-width: 600px)'); // Definir el breakpoint en 600px

	useEffect(() => {
		async function getGames() {
			try {
				const response = await fetchWithAuth({
					isAuthenticated,
					accessToken,
					url: `http://${HOST}:${PORT}/game`,
				});
				if (response.ok) {
					const { games } = await response.json();
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
					url: `http://${HOST}:${PORT}/rank`,
				});
				if (response.ok) {
					const { ranks } = await response.json();
					setRanks(ranks);
				}
			} catch (error) {
				console.log(error);
			}
		}

		if (!user) return;
		if (!accessToken) return;
		setUserId(user.id);
		getGames();
		getRanks();
	}, [accessToken, isAuthenticated, user]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const selectedFile = files[0];
			setPdfFile(selectedFile);
		}
	};

	// Manejador de envío del formulario
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Crea un objeto FormData para enviar los datos del formulario
		const formData = new FormData();

		// Verifica si pdfFile es diferente de null antes de agregarlo a FormData
		if (pdfFile) {
			formData.append('document', pdfFile);
		}

		try {
			// Realiza la solicitud POST al backend

			const response = await fetchWithAuth({
				isAuthenticated: true,
				accessToken,
				url: `http://${HOST}:${PORT}/verification-request`, // Reemplaza con la URL de tu API
				method: 'POST',
				data: {
					user_id: userId,
					game: selectedGame,
					rank: selectedRank,
					filepath: 'path-to-file', //Deberia enviar el archivo, y manejarlo en el back
				},
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
								<InputLabel id='rank-label'> Rango </InputLabel>
								<Select
									labelId='rank-label'
									id='rank-select'
									required
									fullWidth
									value={
										selectedRank
											? selectedRank.description
											: ''
									}
									onChange={(event) => {
										const rankDescription = event.target
											.value as string;
										const selectedRank = ranks.find(
											(rank) =>
												rank.description ===
												rankDescription
										);
										setSelectedRank(selectedRank || null);
									}}
								>
									{ranks.length > 0 ? (
										ranks.map((rankItem, index) => (
											<MenuItem
												key={index}
												value={rankItem.description}
											>
												{rankItem.description}
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
								<InputLabel id='game-label'> Juego </InputLabel>
								<Select
									labelId='game-label'
									id='game-select'
									required
									fullWidth
									value={
										selectedGame ? selectedGame.name : ''
									}
									onChange={(event) => {
										const gameName = event.target
											.value as string;
										const selectedGame = games.find(
											(game) => game.name === gameName
										);
										setSelectedGame(selectedGame || null);
									}}
								>
									{games.length > 0 ? (
										games.map((gameItem, index) => (
											<MenuItem
												key={index}
												value={gameItem.name}
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
