type fetchOptions = {
	url: string;
	isAuthenticated?: boolean;
	accessToken?: string;
	method?: string;
	data?: unknown;
};

export async function fetchWithAuth({
	isAuthenticated,
	accessToken,
	url,
	method = 'GET',
	data,
}: fetchOptions): Promise<globalThis.Response> {
	if (!isAuthenticated || !accessToken) {
		throw new Error('User not authenticated or access token not provided');
	}

	try {
		const body = data ? JSON.stringify(data) : undefined;

		const response = await fetch(url, {
			method: method.toUpperCase(),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}
