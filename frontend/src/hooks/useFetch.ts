import { useState } from 'react';

type useFetchOptions = {
	url: string;
	isAuthenticated?: boolean;
	accessToken?: string;
};

type useFetchReturnType = {
	isLoading: boolean;
	data: unknown;
};

export async function useFetch({
	isAuthenticated,
	accessToken,
	url,
}: useFetchOptions): Promise<useFetchReturnType | undefined> {
	const [isLoading, setIsLoading] = useState(true);

	if (!isAuthenticated) return;
	if (!accessToken) return;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		setIsLoading(false);

		const data = await response.json();
		return { isLoading, data };
	} catch (error) {
		console.error(error);
	}
}
