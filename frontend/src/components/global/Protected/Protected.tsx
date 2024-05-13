import { useAuth0 } from '@auth0/auth0-react';
import { Outlet, Navigate } from 'react-router-dom';

export const Protected = () => {
	const { isAuthenticated, isLoading } = useAuth0();
	return isAuthenticated || isLoading ? <Outlet /> : <Navigate to='/login' />;
};
