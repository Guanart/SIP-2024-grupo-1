import { Fundraising } from './Fundraising';
export interface Collection {
	id: number;
	fundraising_id: number;
	token_prize_percentage: number;
	amount_left: number;
	current_price: number;
	initial_price: number;
	initial_amount: number;
	createdAt: Date;
	updatedAt: Date;
	fundraising: Fundraising;
}
