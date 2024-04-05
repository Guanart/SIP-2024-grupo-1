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
	const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
	const [accessToken, setAccessToken] = useState<string>('');
	const [payload, setPayload] = useState<TokenPayload>({});
	const [permissions, setPermissions] = useState<string[]>([]);
	const [role, setRole] = useState<string>('');

	useEffect(() => {
		const getAccessToken = async () => {
			if (!isAuthenticated || isLoading) return;

			try {
				const token = await getAccessTokenSilently({
					authorizationParams: {
						audience: `http://my-secure-api.com`,
						scope: 'read:current_user',
					},
				});

				setAccessToken(token);
			} catch (error) {
				console.error('Error fetching access token:', error);
			}
		};

		getAccessToken();
	}, [getAccessTokenSilently, isAuthenticated, isLoading]);

	useEffect(() => {
		if (!accessToken) return;
		try {
			const decoded: Token = jwtDecode(accessToken);
			setPayload(decoded);

			const permissions = decoded.permissions || [];
			setPermissions(permissions);

			if (!permissions || permissions.length === 0) {
				return;
			}

			if (permissions.includes('validate:users')) {
				setRole('admin');
				return;
			}
			if (permissions.includes('create:fundraisings')) {
				setRole('player');
				return;
			}

			setRole('user');
		} catch (error) {
			console.error('Error parsing access token:', error);
		}
	}, [accessToken]);

	return {
		accessToken,
		payload,
		permissions,
		role,
	};
}
