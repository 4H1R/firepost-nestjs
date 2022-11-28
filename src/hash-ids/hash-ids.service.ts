import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Hashids from 'hashids';

@Injectable()
export class HashIdsService {
  hashIds: Hashids;

  constructor(private readonly config: ConfigService) {
    this.hashIds = new Hashids(config.get('hashIdsSalt'));
  }

  public encode(...id: number[]) {
    return this.hashIds.encode(id);
  }

  public decode(id: string) {
    return this.hashIds.decode(id);
  }

  public decodeFirst(id: string) {
    return this.decode(id)[0];
  }

  public isValidId(id: string) {
    return this.hashIds.isValidId(id);
  }
}
