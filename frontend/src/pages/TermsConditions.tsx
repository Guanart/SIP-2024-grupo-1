import { Container, Link, Stack, Typography } from '@mui/material';
import { PageLayout } from '../layouts/PageLayout';

export const TermsConditions = () => {
	return (
		<PageLayout>
			<Typography variant='h4'> LOT terms & conditions </Typography>
			<Stack
				direction='column'
				spacing={2}
				sx={{ paddingTop: '56px', paddingBottom: '24px' }}
			>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						1. Introduction
					</Typography>
					<Typography>
						<Typography
							sx={{ fontWeight: 'bold', fontSize: '18px' }}
						>
							Welcome to League of Token (LOT).
						</Typography>
						By using our platform at{' '}
						<Link
							href='https://leagueoftoken.com'
							color='secondary'
						>
							League of Token
						</Link>
						, you agree to be bound by these Terms and Conditions.
						If you do not agree with any of these terms, you should
						not use our services.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						2. Definitions
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							Platform
						</Typography>{' '}
						refers to League of Token (LOT), accessible at{' '}
						<Link
							href='https://leagueoftoken.com'
							color='secondary'
						>
							League of Token
						</Link>
						.
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							User
						</Typography>{' '}
						refers to any person using the Platform.
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							Token
						</Typography>{' '}
						refers to digital units that can be purchased and used
						within the platform.
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							Fundraising
						</Typography>{' '}
						refers to campaigns initiated by players to raise funds
						through the sale of tokens.
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							Player
						</Typography>{' '}
						refers to individuals who initiate fundraisings on the
						platform.
					</Typography>
					<Typography>
						<Typography
							component='span'
							color='secondary'
							sx={{ fontStyle: 'italic' }}
						>
							Mercado Pago
						</Typography>{' '}
						refers to the integrated payment service used to make
						token purchases
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						3. Use of the Platform
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							3.1 Registration.
						</Typography>{' '}
						To use certain services on the Platform, you may need to
						register and create an account. You must provide
						accurate and current information during the registration
						process.
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							3.2 User Responsibility.
						</Typography>{' '}
						You are responsible for maintaining the confidentiality
						of your account and password, and you agree to accept
						responsibility for all activities that occur under your
						account. You must notify LOT immediately of any
						unauthorized use of your account.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						4. Token Purchase
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							4.1 Payment Methods.
						</Typography>{' '}
						Token purchases are made through Mercado Pago. By making
						a purchase, you accept Mercado Pago's terms and
						conditions, in addition to these Terms and Conditions.
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							4.2 Refund Policies.
						</Typography>{' '}
						All token purchases are final and non-refundable, unless
						otherwise stated in a specific refund policy.
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							4.3 Use of Tokens.
						</Typography>{' '}
						Purchased tokens may be used only within the platform
						and have no value outside the platform. They cannot be
						transferred or sold outside the platform.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						5. Player fundraisings
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							5.1 Initiation of fundraisings.
						</Typography>{' '}
						Players may initiate fundraisings to raise funds by
						selling tokens. LOT does not guarantee the success of
						any collection or supports any particular campaign.
					</Typography>
					<Typography>
						<Typography
							component='span'
							sx={{ fontStyle: 'italic' }}
						>
							5.2 Player Responsibility.
						</Typography>{' '}
						Players are responsible for complying with all laws and
						regulations applicable to their fundraising and for
						providing truthful information about their campaigns.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						6. Intellectual Property
					</Typography>
					<Typography>
						All content, trademarks, logos and other materials on
						the Platform are the property of LOT or its licensors
						and are protected by intellectual property laws. You may
						not use, copy, or distribute any of these materials
						without the prior written permission of LOT or the
						respective licensors. Any unauthorized use may violate
						copyright, trademark, and other applicable laws and
						could result in civil or criminal penalties
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						7. Privacy
					</Typography>
					<Typography>
						Our Privacy Policy describes in detail how we collect,
						use, store and protect your personal information. We are
						committed to ensuring the security of your data and use
						this information only to enhance your experience on our
						platform. By using our services, you consent to the
						practices described in our policy, including the
						collection of data necessary for the operation and
						improvement of our services, the use of cookies and
						similar technologies, and communication with you
						regarding your account.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						8. Modifications to Terms and Conditions
					</Typography>
					<Typography>
						LOT reserves the right to modify these Terms and
						Conditions at any time. Modifications will be effective
						immediately upon posting on the platform. It is your
						responsibility to review the Terms and Conditions
						periodically to be informed of any changes.
					</Typography>
				</Container>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
					}}
				>
					<Typography variant='h6' color='secondary'>
						9. Contact
					</Typography>
					<Typography>
						If you have any questions about these Terms and
						Conditions, please contact us at lot@support.com.
					</Typography>
				</Container>
			</Stack>
		</PageLayout>
	);
};
