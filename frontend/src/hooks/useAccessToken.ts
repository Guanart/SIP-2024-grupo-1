import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface TokenPayload extends JwtPayload {
	permissions?: string[];
}

interface Token {
	accessToken: string;
	payload: TokenPayload;
	permissions?: string[];
	role: string;
}

export function useAccessToken(): Token {
	const { getAccessTokenSilently, isAuthenticated } = useAuth0();
	const [accessToken, setAccessToken] = useState<string>('');
	const [payload, setPayload] = useState<TokenPayload>({});
	const [permissions, setPermissions] = useState<string[]>([]);
	const [role, setRole] = useState<string>('user');

	useEffect(() => {
		const getAccessToken = async () => {
			if (!isAuthenticated) return;

			try {
				const token = await getAccessTokenSilently({
					authorizationParams: {
						audience: `http://my-secure-api.com`,
						scope: 'read:current_user',
					},
				});

				setAccessToken(token);

				const decoded: Token = jwtDecode(token);
				setPayload(decoded);

				const permissions = decoded.permissions || [];
				setPermissions(permissions);

				if (permissions) {
					if (permissions.includes('validate:users')) {
						setRole('admin');
					} else if (permissions.includes('create:fundraisings')) {
						setRole('player');
					}
				}
			} catch (error) {
				console.error('Error fetching access token:', error);
			}
		};

		getAccessToken();
	}, [getAccessTokenSilently, isAuthenticated]);

	return {
		accessToken,
		payload,
		permissions,
		role,
	};
}
