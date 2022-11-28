import { Global, Module } from '@nestjs/common';

import { HashIdsService } from './hash-ids.service';

@Global()
@Module({
  providers: [HashIdsService],
  exports: [HashIdsService],
})
export class HashIdsModule {}
