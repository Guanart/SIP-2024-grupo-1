import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class Auth0Service {
  private domain: string;
  private clientId: string;
  private clientSecret: string;
  private audience: string;

  constructor() {
    this.domain = process.env.AUTH0_DOMAIN;
    this.clientId = process.env.AUTH0_CLIENT_ID;
    this.clientSecret = process.env.AUTH0_CLIENT_SECRET;
    this.audience = `https://${this.domain}/api/v2/`;
  }

  private async getAccessToken(): Promise<string> {
    const response = await axios.post(`https://${this.domain}/oauth/token`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: 'client_credentials',
    });

    return response.data.access_token;
  }

  public async assignRolesToUser(userId: string, roles: string[]): Promise<void> {
    const token = await this.getAccessToken();
    const url = `https://${this.domain}/api/v2/users/${userId}/roles`;

    try {
      await axios.post(
        url,
        { roles },
        {
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        },
      );
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Error assigning roles to user',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}