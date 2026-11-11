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
import { RaceSessionsModule } from './race-sessions/race-sessions.module';
import { DriverTeamSeasonsModule } from './driver-team-seasons/driver-team-seasons.module';
import { AuthModule } from './auth/auth.module';
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [PrismaModule, DriversModule, ConstructorsModule, CircuitsModule, SeasonsModule, RacesModule, ResultsModule, RaceSessionsModule, DriverTeamSeasonsModule, AuthModule, IngestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
