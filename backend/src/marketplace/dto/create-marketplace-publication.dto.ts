import { IsNotEmpty, Max, Min } from 'class-validator';

export class CreateMarketplacePublicationDto {
    @IsNotEmpty()
    @Min(0)
    price: number;
    @IsNotEmpty()
    out_wallet_id: number;
    @IsNotEmpty()
    token_id: number
}
