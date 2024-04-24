import { User } from "@prisma/client";

export class Wallet {
    id: number;
    user_id: number;
    cbu: string;
    paypal_id: string;
  }