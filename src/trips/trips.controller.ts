import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { IRequest } from 'src/auth/interface/request.interface';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trips')
export class TripsController {
  private readonly logger = new Logger(TripsController.name);
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(@Body() createTripDto: CreateTripDto, @Req() req: IRequest) {
    try {
      const currentUser = req.user;
      const touristId = createTripDto.user_id;
      const destination = createTripDto.destination;
      const startDate = createTripDto.start_date;
      const endDate = createTripDto.end_date;
      return await this.tripsService.createTrips(
        currentUser,
        touristId,
        destination,
        startDate,
        endDate,
      );
    } catch (error) {
      this.logger.error(`Error when create trip : ${error.message}`);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.EMPLOYEE)
  async findAll(@Req() req: IRequest) {
    try {
      const currentUser = req.user;
      return await this.tripsService.getTrips(currentUser);
    } catch (error) {
      this.logger.error(`Error when get trips : ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: IRequest) {
    try {
      const currentUser = req.user;
      return await this.tripsService.getDetail(currentUser, id);
    } catch (error) {
      this.logger.error(`Error when get detail trip : ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @Req() req: IRequest,
  ) {
    try {
      const currentUser = req.user;
      return this.tripsService.updateTrip(currentUser, id, updateTripDto);
    } catch (error) {
      this.logger.error(`Error when update trip : ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  remove(@Param('id') id: string, @Req() req: IRequest) {
    try {
      const currentUser = req.user;
      return this.tripsService.deleteTrip(currentUser, id);
    } catch (error) {
      this.logger.error(`Error when delete trip : ${error.message}`);
      throw error;
    }
  }
}
