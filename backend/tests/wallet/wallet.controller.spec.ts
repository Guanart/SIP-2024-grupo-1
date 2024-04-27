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

  describe('create', () => {
    it('should create a new wallet for the user', async () => {
      const newWallet = {
        user_id: 1,
        cbu: 'my_cbu3',
        paypal_id: 'my_paypal_id3',
      };

      jest.spyOn(walletService, 'create').mockResolvedValueOnce({} as Wallet);

      const result = await walletController.create(newWallet);

      expect(result).toEqual(
        JSON.stringify({
          message: `Wallet created for the user ${newWallet.user_id}`,
          wallet: {},
        }),
      );
    });
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

  describe('update', () => {
    it('should update a wallet', async () => {
      const updatedWallet = {
        wallet_id: 1,
        cbu: 'my_new_cub',
        paypal_id: 'my_new_paypal_id',
      };

      jest.spyOn(walletService, 'findOne').mockResolvedValueOnce({} as Wallet);

      jest.spyOn(walletService, 'update').mockResolvedValueOnce({
        id: updatedWallet.wallet_id,
      } as Wallet);

      const result = await walletController.update(updatedWallet);

      expect(result).toEqual(
        JSON.stringify({
          message: `Wallet ${updatedWallet.wallet_id} updated`,
          wallet: { id: updatedWallet.wallet_id },
        }),
      );
    });
  });

  it('should delete a wallet', async () => {
    const deletedWallet = {
      wallet_id: 1,
    };

    jest.spyOn(walletService, 'findOne').mockResolvedValueOnce({} as Wallet);

    jest
      .spyOn(walletService, 'delete')
      .mockResolvedValueOnce({ id: deletedWallet.wallet_id } as Wallet);

    const result = await walletController.delete(deletedWallet);

    expect(result).toEqual(
      JSON.stringify({
        message: `Wallet ${deletedWallet.wallet_id} deleted`,
        wallet: { id: deletedWallet.wallet_id },
      }),
    );
  });
});
