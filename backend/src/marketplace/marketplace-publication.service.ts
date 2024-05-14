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
    // TODO: Implementar
  }

  async getAllMarketplacePublications() {
    const publications = await this.prisma.marketplace_publication.findMany({
      where: {
        active: true,
      },
      include: {
        token: true,
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
        token: true,
        out_wallet: {
          include: { user: true },
        },
      },
    });

    console.log(publication);

    return publication ? MarketplacePublication.fromObject(publication) : null;
  }

  async deleteMarketplacePublication(publication_id: number) {
    // TODO: Implementar
  }
}
