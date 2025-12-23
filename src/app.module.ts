import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';
import { TouristsModule } from './tourists/tourists.module';

@Module({
  imports: [UsersModule, TripsModule, TouristsModule],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
