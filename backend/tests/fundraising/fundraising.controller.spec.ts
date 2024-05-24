import { CollectionService } from '../../src/collection/collection.service';
import { PrismaService } from '../../src/database/prisma.service';
import { FundraisingController } from '../../src/fundraising/fundraising.controller';
import { FundraisingService } from '../../src/fundraising/fundraising.service';
import { MercadoPagoService } from '../../src/mercado-pago/mercado-pago.service';
import { TokenService } from '../../src/token/token.service';
import { Fundraising } from '../../src/fundraising/fundraising.entity';

describe('UserController', () => {
  let fundraisingController: FundraisingController;
  let fundraisingService: FundraisingService;
  let collectionService: CollectionService;
  let mercadoPagoService: MercadoPagoService;
  let tokenService: TokenService;
  let prisma: PrismaService;

  beforeEach(() => {
    mercadoPagoService = new MercadoPagoService();
    tokenService = new TokenService(prisma);
    collectionService = new CollectionService(prisma, tokenService);
    fundraisingService = new FundraisingService(
      prisma,
      mercadoPagoService,
      collectionService,
    );

    fundraisingController = new FundraisingController(
      fundraisingService,
      mercadoPagoService,
    );

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new fundraising', async () => {
      const newFundraising = {
        goal_amount: 50000,
        prize_percentage: 50,
        player_id: 1,
        event_id: 1,
        initial_price: 25,
      };

      jest
        .spyOn(fundraisingService, 'createFundraising')
        .mockResolvedValueOnce({ id: 1 } as Fundraising);

      const result =
        await fundraisingController.startFundraising(newFundraising);

      expect(result).toEqual(
        JSON.stringify({
          message: `Fundraising 1 created`,
          fundraising: {
            id: 1,
          },
        }),
      );
    });
  });
  describe('create', () => {
    it('should create a new fundraising', async () => {
      const newFundraising = {
        goal_amount: 50000,
        prize_percentage: 50,
        player_id: 1,
        event_id: 1,
        initial_price: 25,
      };

      jest
        .spyOn(fundraisingService, 'createFundraising')
        .mockResolvedValueOnce({ id: 1 } as Fundraising);

      const result =
        await fundraisingController.startFundraising(newFundraising);

      expect(result).toEqual(
        JSON.stringify({
          message: `Fundraising 1 created`,
          fundraising: {
            id: 1,
          },
        }),
      );
    });
  });

  describe('update', () => {
    it('should update an existing fundraising', async () => {
      const updatedFundraising = {
        goal_amount: 25000,
        initial_price: 12.5,
      };

      jest
        .spyOn(fundraisingService, 'getFundraisingById')
        .mockResolvedValueOnce({
          id: 1,
          goal_amount: 25000,
          collection: { current_price: 25 },
        } as Fundraising);

      jest
        .spyOn(fundraisingService, 'updateFundraising')
        .mockResolvedValueOnce({
          id: 1,
          goal_amount: 25000,
          collection: { current_price: 12.5 },
        } as Fundraising);

      const result = await fundraisingController.updateFundraising(
        '1',
        updatedFundraising,
      );

      expect(result).toEqual(
        JSON.stringify({
          message: `Fundraising 1 updated`,
          updatedFundraising: {
            id: 1,
            goal_amount: 25000,
            collection: { current_price: 12.5 },
          },
          fundraising: {
            id: 1,
            goal_amount: 25000,
            collection: { current_price: 25 },
          },
        }),
      );
    });
  });
});
