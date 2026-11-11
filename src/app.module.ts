import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DriversModule } from './drivers/drivers.module';
import { ConstructorsModule } from './constructors/constructors.module';
import { CircuitsModule } from './circuits/circuits.module';
import { SeasonsModule } from './seasons/seasons.module';
import { RacesModule } from './races/races.module';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [PrismaModule, DriversModule, ConstructorsModule, CircuitsModule, SeasonsModule, RacesModule, ResultsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
