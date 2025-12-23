import { Module } from '@nestjs/common';
import { TouristsService } from './tourists.service';
import { TouristsController } from './tourists.controller';

@Module({
  controllers: [TouristsController],
  providers: [TouristsService],
})
export class TouristsModule {}
