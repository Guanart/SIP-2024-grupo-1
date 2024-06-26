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
                    player: { include: { user: true, game: true, rank: true } },
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
                    player: { include: { user: true, game: true, rank: true } },
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

  async getMarketplacePublicationByTokenId(token_id: number) {
    const publication = await this.prisma.marketplace_publication.findMany({
      where: {
        token_id,
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

    return publication.length > 0
      ? MarketplacePublication.fromObject(publication[0])
      : null;
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

      return publication
        ? MarketplacePublication.fromObject(publication)
        : null;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  async deleteMarketplacePublicationsOfEndedEvents(event_id: number) {
    const fundraisings = await this.prisma.fundraising.findMany({
      where: {
        event_id,
      },
      include: { collection: { include: { token: true } } },
    });

    fundraisings.forEach(({ collection }) => {
      collection.token.forEach(async (token) => {
        const marketplacePublication =
          await this.prisma.marketplace_publication.findFirst({
            where: {
              token_id: token.id,
            },
          });

        if (!marketplacePublication) return;

        const isTokenSold = await this.prisma.in_wallet.count({
          where: { publication_id: marketplacePublication.publication_id },
        });

        if (isTokenSold === 0) {
          await this.deleteMarketplacePublication(
            marketplacePublication.publication_id,
          );
        }
      });
    });
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
