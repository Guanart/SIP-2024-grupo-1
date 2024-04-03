import { useAuth0 } from '@auth0/auth0-react';

export function useAccessToken(): () => Promise<string> {
	const { getAccessTokenSilently } = useAuth0();

	const getToken = async () => {
		const token = await getAccessTokenSilently({
			authorizationParams: {
				audience: `http://my-secure-api.com`,
				scope: 'read:current_user',
			},
		});
		return token;
	};

	return getToken;
}
