import { Player } from './Player';

export type PlayerAnalytic = {
	description: string;
	player: Player;
	data: string;
};

export type EventsAnalytics = {
	description: string;
	events: {
		event_name: string;
		total: number;
	}[];
};

export type PlayersAnalytics = {
	description: string;
	players: {
		player: Player;
		wins: number;
	}[];
	data: string[];
};

export type Analytics = {
	transactions: number;
	sellTransactions: number;
	playersAnalytics: PlayerAnalytic[];
	buyTransactions: number;
	players: number;
	users: number;
	publications: number;
	activePublications: number;
	fundraisings: number;
	inactiveFundraisings: number;
	activeFundraisings: number;
	tokensSold: number;
	successPublications: number;
	averageTokenPrice: number;
};
