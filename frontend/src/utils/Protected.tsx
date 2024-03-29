import { useAuth0 } from '@auth0/auth0-react';
import { Outlet, Navigate } from 'react-router-dom';

const Protected = () => {
	const { isAuthenticated } = useAuth0();
	return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default Protected;
