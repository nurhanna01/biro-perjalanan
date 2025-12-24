import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { seedUsers } from './seed-users';
import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'reflect-metadata';
import { Trip } from 'src/trips/entities/trip.entity';

async function runSeed() {
  const configModule = ConfigModule.forRoot({
    isGlobal: false,
    envFilePath: '.env.local',
  });
  const configService = new ConfigService();

  const AppDataSource = new DataSource({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Trip],
    synchronize: configService.get<boolean>('DB_SYNC'),
  });

  try {
    await AppDataSource.initialize();
    Logger.log('Database connected!');
    await seedUsers(AppDataSource);
    Logger.log('Seed done');
    process.exit(0);
  } catch (err) {
    Logger.error('Database seeding failed:', err);
    process.exit(1);
  }
}

runSeed();
