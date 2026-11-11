import { Module } from '@nestjs/common';
import { ConstructorsController } from './constructors.controller';
import { ConstructorsService } from './constructors.service';

@Module({
  controllers: [ConstructorsController],
  providers: [ConstructorsService]
})
export class ConstructorsModule {}
