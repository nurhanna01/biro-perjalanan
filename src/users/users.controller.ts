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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './entities/user.entity';
import { IRequest } from 'src/auth/interface/request.interface';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  CreateUserInterface,
  User,
  UserDetail,
} from './interface/user-response.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserInterface> {
    try {
      const data = await this.usersService.createUsers(createUserDto);
      return {
        data: {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        },
        message: 'success',
      };
    } catch (error) {
      this.logger.error(`Error when create user : ${error.message}`);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.EMPLOYEE)
  async findAll(): Promise<User[]> {
    try {
      const getData = await this.usersService.findAllUser();
      const data = getData.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }));
      return data;
    } catch (error) {
      this.logger.error(`Error when get user : ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: IRequest,
  ): Promise<UserDetail> {
    try {
      return await this.usersService.findOneUser(req.user, id);
    } catch (error) {
      this.logger.error(`Error when get detail user : ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CreateUserInterface> {
    try {
      const data = await this.usersService.updateUser(id, updateUserDto);
      return {
        data: {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        },
        message: 'success',
      };
    } catch (error) {
      this.logger.error(`Error when update user : ${error.message}`);
      throw error;
    }
  }

  @Delete(':id')
  @Roles(UserRole.EMPLOYEE)
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.removeUser(id);
    } catch (error) {
      this.logger.error(`Error when delete user : ${error.message}`);
      throw error;
    }
  }
}
