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
  Query,
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
import { CreateUserDto } from './users/dto/createUser.dto';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginUserDto } from './users/dto/loginUser.dto';

@Controller()
@UseFilters(
  new AuthFilter(),
  new ConflictExceptionFilter(),
  new NotFoundExceptionFilter(),
)
@UseGuards(RolesGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly meetupService: MeetupService,
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary:"Log in as user",
    description:"If you want to login,use this route"
  })
  @ApiBody({
    type:LoginUserDto
  })
  @Public()
  @Post('auth/login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const user = req.user;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );

    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    req.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);
    return user;
  }

  @ApiOperation({
    summary:"Refresh Access token",
    description:"Use this when your access token has expired to create a new one"
  })
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @ApiOperation({
    summary:"Log out",
    description:"Use this method for loging out"
  })
  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request) {
    await this.usersService.removeRefreshToken(request.cookies.access_token);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return "u have succesfuly logged out"
  }

  
  @ApiOperation({
    summary:"Creates new user",
    description:"Use this method to create a new User"
  })
  @Public()
  @Post('registerUser')
  async registerUser(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({
    summary:"Returns all meetups",
    description:"Use this method to return all meetups"
  })
  @Get()
  async getMeetups(@Query() filter) {
    if (Object.keys(filter).length) {
      return this.meetupService.getMeetups(filter);
    } else {
      return this.meetupService.getAllMeetups();
    }
  }

  @ApiOperation({
    summary:"Returns meetup with a given id",
    description:"Use this method to return a meetup with a speacific id"
  })
  @Get('get/:id')
  getMeetupById(@Param('id', ParseIntPipe) id: number) {
    return this.meetupService.getMeetupById(id);
  }

  @ApiOperation({
    summary:"Created new meetup",
    description:"Use this method to create new meetup"
  })
  @UsePipes(new ValidationPipe())
  @Post('create')
  @Roles('admin')
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

  @ApiOperation({
    summary:"Updates meetup",
    description:"Use this method to update a meetup"
  })
  @Put('change/:id')
  @Roles('admin')
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

  @ApiOperation({
    summary:"Deletes a meetup",
    description:"Use this method to delete all meetups"
  })
  @Delete('delete/:id')
  @Roles('admin')
  deleteMeetup(@Param('id', ParseIntPipe) id: number) {
    return this.meetupService.deleteMeetup(id);
  }

  @ApiOperation({
    summary:"Sign's user for a meetup",
    description:"Use this method to sign for meetup"
  })
  @Post('signup/:meetupId')
  signUpForMeetUp(@Req() req, @Param('meetupId', ParseIntPipe) id: number) {
    return this.meetupService.signUpForMeetup(id, req.cookies.access_token);
  }
}
