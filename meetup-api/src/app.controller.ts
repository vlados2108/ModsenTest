import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
  SetMetadata,
  Res,
  Req,
  UseFilters,
  HttpCode,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MeetupService } from './meetup/meetup.service';
import { CreateMeetupUntransformedDto } from './dto/createMeetupUntransformed.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';
import { UserDto } from './users/dto/user.dto';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators/public';
import { Request, Response } from 'express';
import { AuthFilter } from './exceptionFilters/auth.filter';
import { NotFoundExceptionFilter } from './exceptionFilters/notFound.filter';
import { ConflictExceptionFilter } from './exceptionFilters/conflict.filter';
import JwtRefreshGuard from './auth/guards/jwt-refresh.guard';

@Controller()
@UseFilters(
  new AuthFilter(),
  new ConflictExceptionFilter(),
  new NotFoundExceptionFilter(),
)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly meetupService: MeetupService,
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login') 
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token,user.id)

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie])
    return user
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request) {    
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
  
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('registerUser')
  async registerUser(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  getAllMeetups() {
    return this.meetupService.getMeetups();
  }

  @Get('get/:id')
  getMeetupById(@Param('id', ParseIntPipe) id: number) {
    return this.meetupService.getMeetupById(id);
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  createMeetup(@Body() dto: CreateMeetupUntransformedDto) {
    const data = {
      name: dto.name,

      description: dto.description,

      tegs: dto.tegs,
      time: new Date(dto.time),
      place: dto.place,
    };
    return this.meetupService.createMeetup(data);
  }

  @Put('change/:id')
  changeMeetupInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateMeetupUntransformedDto,
  ) {
    const data = {
      name: dto.name,

      description: dto.description,

      tegs: dto.tegs,
      time: new Date(dto.time),
      place: dto.place,
    };
    return this.meetupService.updateMeetup({ id, data: data });
  }

  @Delete('delete/:id')
  deleteMeetup(@Param('id', ParseIntPipe) id: number) {
    return this.meetupService.deleteMeetup(id);
  }
}
