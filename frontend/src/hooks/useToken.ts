import { useAuth0 } from '@auth0/auth0-react';

export function useToken(): () => Promise<string> {
	const { getAccessTokenSilently } = useAuth0();

	const getToken = async () => {
		const token = await getAccessTokenSilently();
		return token;
	};

	return getToken;
}
