import { WalletService } from '../../src/wallet/wallet.service';
import { PrismaService } from '../../src/database/prisma.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    wallet: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('WalletService', () => {
  let walletService: WalletService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    walletService = new WalletService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new wallet for the user', async () => {
      const newWallet = {
        user_id: 1,
        cbu: 'my_cbu3',
        paypal_id: 'my_paypal_id3',
      };

      await walletService.create(newWallet);

      expect(prisma.wallet.create).toHaveBeenCalledWith({
        data: newWallet,
      });
    });
  });

  describe('findOne', () => {
    it('should find a wallet by wallet_id', async () => {
      const wallet_id = 1;

      await walletService.findOne(wallet_id);

      expect(prisma.wallet.findUnique).toHaveBeenCalledWith({
        where: { id: wallet_id },
        include: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should update a wallet', async () => {
      const updatedWallet = {
        wallet_id: 3,
        cbu: 'my_cbu3',
        paypal_id: 'my_paypal_id3',
      };

      const { wallet_id, cbu, paypal_id } = updatedWallet;

      await walletService.update(updatedWallet);

      expect(prisma.wallet.update).toHaveBeenCalledWith({
        where: {
          id: wallet_id,
        },
        data: { cbu, paypal_id },
      });
    });
  });
});
