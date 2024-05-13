import { CircularProgress } from '@mui/material';
import './Loader.css';

export const Loader = () => {
	return (
		<div className='loader-container'>
			<CircularProgress color='secondary' />
		</div>
	);
};
