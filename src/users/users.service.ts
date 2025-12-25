import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUsers(createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );
      const createUser = await this.userRepository.save({
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
        password: hashPassword,
      });
      return createUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email already exists');
      }
      this.logger.error(`Error when create user : ${error}`);
      throw error;
    }
  }

  async findAllUser() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      this.logger.error(`Error when get user : ${error}`);
      throw error;
    }
  }

  async findOneUser(currentUser: User, id: string) {
    try {
      let data;
      if (currentUser.role == UserRole.EMPLOYEE) {
        data = await this.userRepository.find({
          relations: ['trips'],
          where: { id },
        });
      } else if (id == currentUser.id) {
        data = await this.userRepository.find({
          relations: ['trips'],
          where: { id },
        });
      }
      if (data.length == 0) throw new NotFoundException('user not found');
      return data;
    } catch (error) {
      this.logger.error(`Error when get detail user : ${error}`);
      throw error;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error when update user : ${error}`);
      throw error;
    }
  }

  async removeUser(id: string) {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException('User not found');
      return { deleted: true };
    } catch (error) {
      this.logger.error(`Error when remove user : ${error}`);
      throw error;
    }
  }
}
