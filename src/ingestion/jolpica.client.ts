import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface JolpicaConstructor {
  constructorId: string;
  name: string;
  nationality: string;
  url: string;
}

interface JolpicaDriver {
  code?: string;
  dateOfBirth: string;
  driverId: string;
  familyName: string;
  givenName: string;
  nationality: string;
  permanentNumber?: string;
  url: string;
}

interface JolpicaRace {
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: {
      country: string;
      lat: string;
      long: string;
      locality: string;
    };
    url: string;
  };
  date: string;
  raceName: string;
  round: string;
  season: string;
  time?: string;
  url: string;
  Results?: JolpicaRaceResult[];
}

interface JolpicaRaceResult {
  Constructor: JolpicaConstructor;
  Driver: JolpicaDriver;
  FastestLap?: {
    Time?: {
      time: string;
    };
    lap: string;
    rank: string;
  };
  grid: string;
  laps: string;
  number: string;
  points: string;
  position: string;
  positionText: string;
  status: string;
  Time?: {
    millis: string;
    time: string;
  };
}

interface JolpicaResponse {
  MRData: {
    limit: string;
    offset: string;
    total: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class JolpicaClient {
  private readonly baseUrl = 'https://api.jolpi.ca/ergast/f1';
  private readonly limit = 100;

  constructor(private readonly httpService: HttpService) { }

  async get<T>(path: string, collectionPath: string): Promise<T[]> {
    const results: T[] = [];
    let offset = 0;
    let total = 0;

    do {
      const response = await firstValueFrom(
        this.httpService.get<JolpicaResponse>(
          `${this.baseUrl}/${path}.json`,
          {
            headers: {
              'User-Agent': 'F1DataPlatform/1.0.0',
            },
            params: {
              limit: this.limit,
              offset,
            },
          },
        ),
      );

      const data = response.data.MRData;
      const collection = collectionPath
        .split('.')
        .reduce<unknown>(
          (value, key) =>
            (value as Record<string, unknown>)[key],
          data,
        );

      if (!Array.isArray(collection)) {
        throw new Error(`Invalid Jolpica response: ${collectionPath}`);
      }

      results.push(...(collection as T[]));
      total = Number(data.total);
      offset += this.limit;
    } while (offset < total);

    return results;
  }

  async getSeasonConstructors(year: number): Promise<JolpicaConstructor[]> {
    return this.get<JolpicaConstructor>(
      `${year}/constructors`,
      'ConstructorTable.Constructors',
    );
  }

  async getSeasonDrivers(year: number): Promise<JolpicaDriver[]> {
    return this.get<JolpicaDriver>(
      `${year}/drivers`,
      'DriverTable.Drivers',
    );
  }

  async getSeasonRaces(year: number): Promise<JolpicaRace[]> {
    return this.get<JolpicaRace>(
      `${year}`,
      'RaceTable.Races',
    );
  }

  async getSeasonResults(year: number): Promise<JolpicaRace[]> {
    return this.get<JolpicaRace>(
      `${year}/results`,
      'RaceTable.Races',
    );
  }
}