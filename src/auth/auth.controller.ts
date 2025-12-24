import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const token = 'Bearer ' + (await this.authService.findOne(loginDto));
      return { token };
    } catch (error) {
      this.logger.error(`Error when login : ${error.message}`);
      throw error;
    }
  }
}
