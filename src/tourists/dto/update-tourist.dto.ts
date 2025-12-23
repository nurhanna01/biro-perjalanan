import { PartialType } from '@nestjs/mapped-types';
import { CreateTouristDto } from './create-tourist.dto';

export class UpdateTouristDto extends PartialType(CreateTouristDto) {}
