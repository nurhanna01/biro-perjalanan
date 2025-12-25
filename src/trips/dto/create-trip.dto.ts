import { IsString, IsDateString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  user_id: string;

  @IsString()
  destination: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
