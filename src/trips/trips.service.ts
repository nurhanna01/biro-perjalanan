import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { User, UserRole } from 'src/users/entities/user.entity';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);
  constructor(
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createTrips(
    currentUser: User,
    touristId: string,
    destination: string,
    startDate: string,
    endDate: string,
  ) {
    try {
      const user = await this.userRepo.findOne({
        where: { id: touristId },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${touristId} not found`);
      }
      const trip = this.tripRepo.create({
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        user: { id: touristId } as User,
      });

      const saveData = await this.tripRepo.save(trip);

      if (!saveData.id) throw new InternalServerErrorException();

      return saveData;
    } catch (error) {
      this.logger.error(`Error when create trip : ${error.message}`);
      throw error;
    }
  }

  async getTrips(currentUser: User) {
    try {
      if (currentUser.role === UserRole.EMPLOYEE) {
        return this.tripRepo.find({
          relations: ['user'],
          order: { startDate: 'DESC' },
        });
      } else {
        return this.tripRepo.find({
          where: { user: { id: currentUser.id } },
          order: { startDate: 'DESC' },
        });
      }
    } catch (error) {
      this.logger.error(`Error when get trips : ${error.message}`);
      throw error;
    }
  }

  async getDetail(currentUser: User, id: string) {
    try {
      let data;
      if (currentUser.role === UserRole.EMPLOYEE) {
        data = await this.tripRepo.find({
          relations: ['user'],
          where: { id },
        });
      } else if (currentUser.role === UserRole.TOURIST) {
        data = await this.tripRepo.find({
          relations: ['user'],
          where: { id, user: { id: currentUser.id } },
        });
      }
      if (data.length == 0) throw new NotFoundException();
      return data;
    } catch (error) {
      this.logger.error(`Error when get detail trip : ${error.message}`);
      throw error;
    }
  }

  async updateTrip(currentUser: User, tripId: string, data: Partial<Trip>) {
    try {
      if (currentUser.role !== UserRole.EMPLOYEE) {
        throw new ForbiddenException('Only employees can update trips.');
      }

      const trip = await this.tripRepo.findOne({ where: { id: tripId } });
      if (!trip) throw new NotFoundException('Trip not found');

      Object.assign(trip, data);
      return this.tripRepo.save(trip);
    } catch (error) {
      this.logger.error(`Error when update trip : ${error.message}`);
      throw error;
    }
  }

  async deleteTrip(currentUser: User, tripId: string) {
    try {
      if (currentUser.role !== UserRole.EMPLOYEE) {
        throw new ForbiddenException('Only employees can delete trips.');
      }

      const result = await this.tripRepo.delete(tripId);
      if (result.affected === 0) throw new NotFoundException('Trip not found');
      return { deleted: true };
    } catch (error) {
      this.logger.error(`Error when delete trip : ${error.message}`);
      throw error;
    }
  }
}
