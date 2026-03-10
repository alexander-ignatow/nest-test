import { Injectable } from '@nestjs/common';

export interface ThirdPartyResponse {
  source: string;
  endpoint: string;
  data: Record<string, unknown>;
}

@Injectable()
export class ThirdPartyService {
  async getData(endpoint: string): Promise<ThirdPartyResponse> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return {
      source: 'third-party-api',
      endpoint,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    };
  }

  async postData(endpoint: string, body: unknown): Promise<ThirdPartyResponse> {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return {
      source: 'third-party-api',
      endpoint,
      data: {
        status: 'created',
        received: body,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
