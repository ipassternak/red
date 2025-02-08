import { Module } from '@nestjs/common';

import { UserService } from '@src/user/user.service';

import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';

@Module({
  imports: [],
  controllers: [QuestController],
  providers: [QuestService, UserService],
  exports: [],
})
export class QuestModule {}
