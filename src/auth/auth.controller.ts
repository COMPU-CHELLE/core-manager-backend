import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SwitchCompanyDto } from './dto/switch-company.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { JwtPayload } from './types/jwt-payload.type';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.identifier, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('switch-company')
  @HttpCode(200)
  async switchCompany(
    @Req() req: AuthenticatedRequest,
    @Body() { companyId }: SwitchCompanyDto,
  ) {
    const userId = req.user!.sub;
    return this.authService.switchCompany(userId, companyId ?? null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-companies')
  async getAvailableCompanies(@Req() req: AuthenticatedRequest) {
    const userId = req.user!.sub;
    return this.authService.getAvailableCompanies(userId);
  }
}
