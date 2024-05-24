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
			const { message, status } = await response.json();

			if (status >= 500) {
				throw new Error(`Internal server error`);
			}

			if (Array.isArray(message)) {
				throw new Error(
					`${
						message[0].charAt(0).toUpperCase() + message[0].slice(1)
					}`
				);
			}

			throw new Error(
				`${message.charAt(0).toUpperCase() + message.slice(1)}`
			);
		}

		return response;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
}
