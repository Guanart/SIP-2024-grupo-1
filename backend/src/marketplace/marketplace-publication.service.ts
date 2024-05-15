import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMarketplacePublicationDto } from './dto/create-marketplace-publication.dto';
import { MarketplacePublication } from './marketplace-publication.entity';

@Injectable()
export class MarketplacePublicationService {
  constructor(private prisma: PrismaService) {}

  async createMarketplacePublication(
    newPublication: CreateMarketplacePublicationDto,
  ) {
    const { price, out_wallet_id, token_id } = newPublication;
    const marketplace_publication =
      await this.prisma.marketplace_publication.create({
        data: {
          price,
          out_wallet_id,
          token_id,
        },
      });
    return marketplace_publication
      ? MarketplacePublication.fromObject(marketplace_publication)
      : null;
  }

  async getAllMarketplacePublications() {
    const publications = await this.prisma.marketplace_publication.findMany({
      where: {
        active: true,
      },
      include: {
        token: {
          include: {
            collection: {
              include: {
                fundraising: {
                  include: {
                    player: { include: { user: true, game: true } },
                    event: true,
                  },
                },
              },
            },
          },
        },
        out_wallet: {
          include: { user: true },
        },
      },
    });

    return publications
      ? publications.map((publication) =>
          MarketplacePublication.fromObject(publication),
        )
      : null;
  }

  async getMarkplacePublicationById(publication_id: number) {
    const publication = await this.prisma.marketplace_publication.findUnique({
      where: {
        publication_id,
        active: true,
      },
      include: {
        token: {
          include: {
            collection: {
              include: {
                fundraising: {
                  include: {
                    player: { include: { user: true, game: true } },
                    event: true,
                  },
                },
              },
            },
          },
        },
        out_wallet: {
          include: { user: true },
        },
      },
    });

    return publication ? MarketplacePublication.fromObject(publication) : null;
  }

  async getUserActiveMarketplacePublications(wallet_id: number) {
    const publications = await this.prisma.marketplace_publication.findMany({
      where: {
        out_wallet_id: wallet_id,
        active: true,
      },
      include: {
        token: {
          include: {
            collection: {
              include: {
                fundraising: {
                  include: {
                    player: { include: { user: true, game: true } },
                    event: true,
                  },
                },
              },
            },
          },
        },
        out_wallet: {
          include: { user: true },
        },
      },
    });

    return publications
      ? publications.map((publication) =>
          MarketplacePublication.fromObject(publication),
        )
      : [];
  }

  async deleteMarketplacePublication(publication_id: number) {
    try {
      const publication = await this.prisma.marketplace_publication.delete({
        where: {
          publication_id,
          active: true,
        },
        include: {
          token: {
            include: {
              collection: {
                include: {
                  fundraising: {
                    include: {
                      player: { include: { user: true, game: true } },
                      event: true,
                    },
                  },
                },
              },
            },
          },
          out_wallet: {
            include: { user: true },
          },
        },
      });

      console.log(publication);

      return publication
        ? MarketplacePublication.fromObject(publication)
        : null;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async buyMarketplacePublication(publication_id: number, wallet_id: number) {
    const marketplace_publication =
      await this.prisma.marketplace_publication.update({
        where: { publication_id: publication_id },
        data: {
          active: false,
        },
      });

    await this.prisma.in_wallet.create({
      data: {
        publication_id: publication_id,
        wallet_id: wallet_id,
      },
    });
    return marketplace_publication
      ? MarketplacePublication.fromObject(marketplace_publication)
      : null;
  }
}
