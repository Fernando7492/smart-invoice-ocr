import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

interface RequestWithUser {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: { email: string; pass: string }): Promise<User> {
    return this.authService.register(body.email, body.pass);
  }
}
