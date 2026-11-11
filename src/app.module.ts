import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DriversModule } from './drivers/drivers.module';
import { ConstructorsModule } from './constructors/constructors.module';

@Module({
  imports: [PrismaModule, DriversModule, ConstructorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
