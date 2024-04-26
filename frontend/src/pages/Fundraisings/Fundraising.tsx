import { useState } from 'react';
import { Stack, Typography, LinearProgress, TextField } from '@mui/material';
import { PageLayout } from '../../layouts/PageLayout';
import { FundraisingCard } from '../../components/fundraisings/FundraisingCard';

export const Fundraising = () => {
	const [amount, setAmount] = useState<number>(1);

	function handleAmountChange(value: string) {
		const nextAmount: number = parseInt(value.trim()) ?? 1;
		if (nextAmount > 0) {
			setAmount(nextAmount);
		} else {
			setAmount(1);
		}
	}

	return (
		<PageLayout title='Fundraising'>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				spacing={{ xs: '24px', md: '48px' }}
				sx={{ paddingTop: '32px', justifyContent: 'center' }}
			>
				<Stack sx={{ paddingX: '0px', width: '350px' }} spacing='8px'>
					<Typography component='div' variant='h6'>
						Goal amount
						<Typography
							color='secondary'
							component='div'
							variant='h6'
							sx={{
								display: 'inline',
								marginLeft: '6px',
								fontWeight: 'bold',
							}}
						>
							U$D 50.000
						</Typography>
					</Typography>
					<Typography component='div' variant='h6'>
						Goal progress
						<Typography
							color='secondary'
							component='div'
							variant='h6'
							sx={{
								display: 'inline',
								marginLeft: '6px',
								fontWeight: 'bold',
							}}
						>
							U$D 0
							<LinearProgress
								variant='determinate'
								value={0}
								color='secondary'
								sx={{ height: '20px', ml: '2px', mt: '4px' }}
							/>
						</Typography>
					</Typography>
					<Typography component='div' variant='h6'>
						Tokens left
						<Typography
							color='secondary'
							component='div'
							variant='h6'
							sx={{
								display: 'inline',
								marginLeft: '6px',
								fontWeight: 'bold',
							}}
						>
							1000/1000
							<LinearProgress
								variant='determinate'
								value={100}
								color='secondary'
								sx={{ height: '20px', ml: '2px', mt: '4px' }}
							/>
						</Typography>
					</Typography>
					<Typography component='div' variant='h6'>
						Event prize
						<Typography
							color='secondary'
							component='div'
							variant='h6'
							sx={{
								display: 'inline',
								marginLeft: '6px',
								fontWeight: 'bold',
							}}
						>
							U$D 1.000.000
						</Typography>
					</Typography>
					<Typography component='div' variant='h6'>
						Percentage of prize
						<Typography
							color='secondary'
							component='div'
							variant='h6'
							sx={{
								display: 'inline',
								marginLeft: '6px',
								fontWeight: 'bold',
							}}
						>
							20%
						</Typography>
					</Typography>
					<Typography component='div' variant='h6'>
						Token details
						<Stack sx={{ paddingLeft: '8px' }}>
							<Typography component='div' variant='body2'>
								Token ID
								<Typography
									color='secondary'
									component='div'
									variant='body2'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									1
								</Typography>
							</Typography>
							<Typography component='div' variant='body2'>
								Percentage per token
								<Typography
									color='secondary'
									component='div'
									variant='body2'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									0.02%
								</Typography>
							</Typography>
							<Typography component='div' variant='body2'>
								Prize per token
								<Typography
									color='secondary'
									component='div'
									variant='body2'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									Max. U$D 200
								</Typography>
							</Typography>
							<Typography component='div' variant='body2'>
								Token price
								<Typography
									color='secondary'
									component='div'
									variant='body2'
									sx={{
										display: 'inline',
										marginLeft: '6px',
										fontWeight: 'bold',
									}}
								>
									U$D 50
								</Typography>
							</Typography>
						</Stack>
					</Typography>
				</Stack>
				<FundraisingCard showActions={false} />
			</Stack>
			<Stack
				sx={{
					mx: 'auto',
					mt: '24px',
					width: '750px',
				}}
				direction='row'
				spacing='4px'
			>
				<TextField
					id='outlined-number'
					label='Amount'
					type='number'
					value={amount}
					onChange={(event) => handleAmountChange(event.target.value)}
					inputProps={{ maxLength: 80 }}
					sx={{ maxWidth: '100px' }}
				/>
				<button style={{ maxWidth: '250px' }}>
					Mercado pago button
				</button>
			</Stack>
		</PageLayout>
	);
};
