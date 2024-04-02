import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return JSON.stringify({
      message: `Hello World! This is a public route`,
    });
  }

  getUserHello(): string {
    return JSON.stringify({
      message: `Hello World! You are a common user`,
    });
  }

  getPlayerHello(): string {
    return JSON.stringify({
      message: `Hello World! You are a player`,
    });
  }

  getAdminHello(): string {
    return JSON.stringify({
      message: `Hello World! You are an admin`,
    });
  }
}
