import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { JwtPayload, jwtDecode } from 'jwt-decode';

type Token = {
	accessToken: string;
	payload: JwtPayload;
};

export function useAccessToken(): Token {
	const { getAccessTokenSilently } = useAuth0();
	const [accessToken, setAcessToken] = useState('');
	const [payload, setPayload] = useState<JwtPayload>({});

	useEffect(() => {
		const getAccessToken = async () => {
			const token = await getAccessTokenSilently({
				authorizationParams: {
					audience: `http://my-secure-api.com`,
					scope: 'read:current_user',
				},
			});
			return token;
		};

		getAccessToken().then((accessToken) => {
			setAcessToken(accessToken);
			const decoded = jwtDecode(accessToken);

			setPayload(decoded);
		});
	}, [getAccessTokenSilently]);

	return { accessToken, payload };
}
