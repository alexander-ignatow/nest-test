import { Injectable } from '@nestjs/common';

@Injectable()
export class ThirdPartyService {
  async getData(endpoint: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return {
      source: 'third-party-api',
      endpoint,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    };
  }

  async postData(endpoint: string, body: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 10));
    return {
      source: 'third-party-api',
      endpoint,
      data: { status: 'created', received: body, timestamp: new Date().toISOString() },
    };
  }
}
