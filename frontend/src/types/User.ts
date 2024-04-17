export interface User {
	auth0_id: string;
	id: number;
	avatar: string;
	username: string;
	email: string;
	biography?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface UpdatedUser {
	auth0_id?: string;
	username?: string;
	avatar?: string;
	biography?: string;
}
