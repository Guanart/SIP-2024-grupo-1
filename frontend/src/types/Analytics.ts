import { Player } from './Player';

export type PlayerAnalytic = {
	description: string;
	player: Player;
	data: string;
};

export type GameAnalytics = {
	game: string;
	events: number;
	total: number;
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

export type AverageTokenPriceAnalytics = {
	averagePrice: number;
	eventAveragePrice: number;
	averagePriceByEdition: {
		string: {
			date: Date;
			average: number;
			editions: number;
			total: number;
			min: number;
			max: number;
		};
	};
};

export type EarningsAnalytics = {
	transactions: number;
	buy: number;
	sell: number;
	earnings: number;
	transactionsByDay: {
		date: Date;
		amount: number;
		earnings: number;
	}[];
};
