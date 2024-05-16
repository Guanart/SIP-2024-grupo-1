import { PrismaService } from '../../src/database/prisma.service';
import { MarketplacePublicationService } from '../../src/marketplace/marketplace-publication.service';

jest.mock('../../src/database/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    marketplace_publication: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe('MarketplacePublicationService', () => {
  let marketplacePublicationService: MarketplacePublicationService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    marketplacePublicationService = new MarketplacePublicationService(prisma);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMarketplacePublication', () => {
    it('should create a new marketplace publication', async () => {
      const newPublication = {
        price: 10,
        token_id: 1,
        out_wallet_id: 1,
      };

      await marketplacePublicationService.createMarketplacePublication(
        newPublication,
      );

      expect(prisma.marketplace_publication.create).toHaveBeenCalledWith({
        data: newPublication,
      });
    });
  });

  describe('deleteMarketplacePublication', () => {
    it('should delete a marketplace publication', async () => {
      const publication_id = 1;

      await marketplacePublicationService.deleteMarketplacePublication(
        publication_id,
      );

      expect(prisma.marketplace_publication.delete).toHaveBeenCalledWith({
        where: { publication_id: publication_id, active: true },
        include: expect.any(Object),
      });
    });
  });
});
