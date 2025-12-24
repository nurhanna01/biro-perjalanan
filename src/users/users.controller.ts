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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles(UserRole.EMPLOYEE)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const data = await this.usersService.createUsers(createUserDto);
      return {
        data: { email: data.email, name: data.name },
        message: 'success',
      };
    } catch (error) {
      this.logger.error(`Error when create user : ${error.message}`);
      throw error;
    }
  }

  @Get()
  @Roles(UserRole.EMPLOYEE)
  async findAll() {
    try {
      return await this.usersService.findAllUser();
    } catch (error) {
      this.logger.error(`Error when get user : ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: IRequest) {
    try {
      return await this.usersService.findOneUser(req.user, id);
    } catch (error) {
      this.logger.error(`Error when get detail user : ${error.message}`);
      throw error;
    }
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.updateUser(id, updateUserDto);
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
