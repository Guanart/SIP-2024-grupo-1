import Box from '@mui/material/Box';
import { Modal, Typography } from '@mui/material/';
import { FunctionComponent, ReactElement } from 'react';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

interface ModalProps {
	children: ReactElement;
	title: string;
	isOpen: boolean;
	handleClose: () => void;
}

export const BasicModal: FunctionComponent<ModalProps> = ({
	children,
	title,
	isOpen,
	handleClose,
}) => {
	return (
		<div>
			<Modal
				open={isOpen}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
			>
				<>
					<Box sx={style}>
						<Typography
							id='modal-modal-title'
							variant='h5'
							component='h3'
							color='primary'
							sx={{ p: '4px', py: '24px', paddingBottom: '12px' }}
						>
							{title}
						</Typography>
						{children}
					</Box>
				</>
			</Modal>
		</div>
	);
};
