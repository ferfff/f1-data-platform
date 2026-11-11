import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DriversModule } from './drivers/drivers.module';
import { ConstructorsModule } from './constructors/constructors.module';
import { CircuitsModule } from './circuits/circuits.module';

@Module({
  imports: [PrismaModule, DriversModule, ConstructorsModule, CircuitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
