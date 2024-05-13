import { PrismaService } from '../../src/database/prisma.service';
import { WalletService } from '../../src/wallet/wallet.service';
import { WalletController } from '../../src/wallet/wallet.controller';
import { Wallet } from '../../src/wallet/wallet.entity';

describe('WalletController', () => {
  let walletController: WalletController;
  let walletService: WalletService;
  let prisma: PrismaService;

  beforeEach(() => {
    walletService = new WalletService(prisma);
    walletController = new WalletController(walletService);
  });

  describe('find', () => {
    it('should find a wallet by wallet_id', async () => {
      const wallet_id = 1;

      jest
        .spyOn(walletService, 'findOne')
        .mockResolvedValueOnce({ id: wallet_id } as Wallet);

      const result = await walletController.findOne(wallet_id.toString());

      expect(result).toEqual(
        JSON.stringify({
          message: `Wallet ${wallet_id} found`,
          wallet: { id: wallet_id },
        }),
      );
    });
  });
});
