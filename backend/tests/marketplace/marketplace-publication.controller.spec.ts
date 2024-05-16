import { PrismaService } from '../../src/database/prisma.service';
import { MarketplacePublicationController } from '../../src/marketplace/marketplace-publication.controller';
import { MarketplacePublicationService } from '../../src/marketplace/marketplace-publication.service';
import { MarketplacePublication } from '../../src/marketplace/marketplace-publication.entity';

describe('MarketplaceController', () => {
  let marketplaceController: MarketplacePublicationController;
  let marketplaceService: MarketplacePublicationService;
  let prisma: PrismaService;

  jest.mock('../../src/marketplace/marketplace-publication.service.ts', () => ({
    MarketplacePublicationService: jest.fn().mockImplementation(() => ({
      getMarkplacePublicationById: jest.fn(),
      deleteMarketplacePublication: jest.fn(),
      createMarketplacePublication: jest.fn(),
    })),
  }));

  beforeEach(() => {
    marketplaceService = new MarketplacePublicationService(prisma);
    marketplaceController = new MarketplacePublicationController(
      marketplaceService,
    );
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a marketplace publication', async () => {
      jest
        .spyOn(marketplaceService, 'createMarketplacePublication')
        .mockResolvedValueOnce({
          publication_id: 123,
        } as MarketplacePublication);

      const result = await marketplaceController.createMarketplacePublication({
        price: 10,
        out_wallet_id: 1,
        token_id: 1,
      });

      expect(result).toEqual(
        JSON.stringify({
          message: `Publication ${123} created`,
          publication: { publication_id: 123 },
        }),
      );
    });
  });

  describe('delete', () => {
    it('should delete a marketplace publication', async () => {
      jest
        .spyOn(marketplaceService, 'getMarkplacePublicationById')
        .mockResolvedValueOnce({
          publication_id: 123,
        } as MarketplacePublication);

      jest
        .spyOn(marketplaceService, 'deleteMarketplacePublication')
        .mockResolvedValueOnce({
          publication_id: 123,
        } as MarketplacePublication);

      const result =
        await marketplaceController.deleteMarkplacePublicationById('123');

      expect(result).toEqual(
        JSON.stringify({
          message: `Marketplace publication ${123} deleted`,
        }),
      );
    });
  });
});
