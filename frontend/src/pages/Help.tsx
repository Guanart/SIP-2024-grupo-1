import {
	Accordion,
	AccordionSummary,
	Box,
	Button,
	Container,
	Stack,
	AccordionDetails,
} from '@mui/material';
import { ExpandMoreIcon } from '../global/icons';
import { PageLayout } from '../layouts/PageLayout';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';

export const Help = () => {
	return (
		<PageLayout title='Help'>
			<Stack
				direction={{ xs: 'column', md: 'row' }}
				justifyContent='center'
				spacing={{ xs: 8, md: 0 }}
				sx={{
					display: 'flex',
					alignItems: 'center',
					marginTop: '50px',
					width: '100%',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography
						variant='h2'
						sx={{
							maxWidth: '800px',
							fontWeight: 'bold',
						}}
						color='secondary'
					>
						Help center
					</Typography>
					<Typography variant='h4' sx={{ maxWidth: '500px' }}>
						Find answers to your questions and get the support you
						need.
					</Typography>
					<Stack
						direction='row'
						spacing={1}
						sx={{ marginTop: '8px' }}
					>
						<Button
							variant='contained'
							color='secondary'
							sx={{ maxWidth: '200px' }}
						>
							Contact us
						</Button>
						<Link to='/terms'>
							<Button variant='contained' color='secondary'>
								Terms & conditions
							</Button>
						</Link>
					</Stack>
				</Box>
				<img
					src='/assets/images/contact.png'
					style={{ maxWidth: '600px', width: '100%' }}
				/>
			</Stack>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: '100px',
				}}
			>
				<Typography
					variant='h4'
					sx={{ maxWidth: '800px', paddingBottom: '12px' }}
				>
					Frequently asked questions
				</Typography>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls='panel1-content'
						id='panel1-header'
						sx={{ fontSize: '18px', paddingY: '8px' }}
					>
						What is a fundraising token?
					</AccordionSummary>
					<AccordionDetails>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls='panel2-content'
						id='panel2-header'
						sx={{ fontSize: '18px', paddingY: '8px' }}
					>
						How do I create a token?
					</AccordionSummary>
					<AccordionDetails>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</AccordionDetails>
				</Accordion>
				<Accordion defaultExpanded>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls='panel3-content'
						id='panel3-header'
						sx={{ fontSize: '18px', paddingY: '8px' }}
					>
						What are the benefits of buying a token?
					</AccordionSummary>
					<AccordionDetails>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</AccordionDetails>
				</Accordion>
				<Accordion defaultExpanded>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls='panel4-content'
						id='panel4-header'
						sx={{ fontSize: '18px', paddingY: '8px' }}
					>
						What support options are available?
					</AccordionSummary>
					<AccordionDetails>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</AccordionDetails>
				</Accordion>
			</Container>
			<Container
				sx={{
					display: 'flex',
					alignItems: 'center',
					marginTop: '100px',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography
						variant='h4'
						sx={{ maxWidth: '800px' }}
						color='secondary'
					>
						Still have questions?
					</Typography>
					<Typography variant='h5' sx={{ maxWidth: '800px' }}>
						Don't hesitate to reach out to our support team.
					</Typography>
					<Typography variant='h5' sx={{ maxWidth: '800px' }}>
						We're here to help you every step of the way.
					</Typography>
					<Button
						variant='contained'
						color='secondary'
						sx={{ maxWidth: '300px' }}
					>
						Contact us
					</Button>
				</Box>
			</Container>
		</PageLayout>
	);
};
