import { Module } from '@nestjs/common';

import { UserService } from '@src/user/user.service';

import { ConstructorController } from './constructor.controller';
import { ConstructorService } from './constructor.service';
import { QuestController } from './quest.controller';
import { QuestService } from './quest.service';

@Module({
  imports: [],
  controllers: [QuestController, ConstructorController],
  providers: [QuestService, ConstructorService, UserService],
  exports: [],
})
export class QuestModule {}
