import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async findOne(loginDto: LoginDto) {
    try {
      const user = await this.userRepo.findOneBy({
        email: loginDto.email,
      });
      if (!user) throw new NotFoundException('user not found');
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) throw new UnauthorizedException();

      return await this.jwtService.signAsync({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      this.logger.error(`Error when login : ${error.message}`);
      throw error;
    }
  }
}
