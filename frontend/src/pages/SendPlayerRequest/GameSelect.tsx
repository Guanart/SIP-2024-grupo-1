import { useEffect, useState } from 'react';
import {
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	SelectChangeEvent,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAccessToken } from '../../hooks';
import { Game } from '../../types';

const HOST = import.meta.env.APP_BACKEND_HOST;
const PORT = import.meta.env.APP_BACKEND_PORT;

export const GameSelect = () => {
	const { user, isAuthenticated } = useAuth0();
	const [games, setGames] = useState<Game[]>([]);
	const [selectedGame, setSelectedGame] = useState<Game | null>(null);
	const { accessToken } = useAccessToken();
	const [labelJuegos, setLabelJuegos] = useState<string>('Juegos');

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
		if (!user) return;
		if (!accessToken) return;
		getGames();
	}, [accessToken, isAuthenticated, user]);

	const handleGameSelect = (event: SelectChangeEvent<number>) => {
		const selectedGameId = event.target.value;
		const game = games.find((game) => game.id === selectedGameId);
		if (game) {
			setSelectedGame(game);
			setLabelJuegos(game.name); // Actualiza el labelJuegos cuando se selecciona un juego
		}
	};

	return (
		<FormControl fullWidth>
			<InputLabel id='game-label'>{labelJuegos}</InputLabel>
			<Select
				labelId='game-label'
				id='game-select'
				value={selectedGame ? selectedGame.id : ''}
				onChange={handleGameSelect}
				required
				fullWidth
			>
				{games.length > 0 ? (
					games.map((gameItem, index) => (
						<MenuItem key={index} value={gameItem.id}>
							{gameItem.name}
						</MenuItem>
					))
				) : (
					<MenuItem disabled>
						No hay juegos disponibles por el momento
					</MenuItem>
				)}
			</Select>
		</FormControl>
	);
};
