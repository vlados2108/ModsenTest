import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe,SetMetadata, Res,Req  } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMeetupDto } from './meetup/dto/createMeetup.dto';
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
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly meetupService: MeetupService,private authService:AuthService,private readonly userService:UsersService,private readonly configService:ConfigService) {}
  
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login')
  async login (@Req() req,@Res({passthrough:true}) res:Response){
    const {access_token} = await this.authService.login(req.user)
    res.cookie("access_token",access_token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      expires:new Date(Date.now() + 1*24*60*1000)
    }).send({status:'ok'})
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
  
  @Public()
  @Post('registerUser')
  async registerUser(@Body() userDto:UserDto){
    return this.userService.createUser(userDto)
  }

  @Get()
  getAllMeetups(){
    return this.meetupService.getMeetups()
  }

  @Get('get/:id')
  getMeetupById(@Param('id',ParseIntPipe)id:number){
    return this.meetupService.getMeetup(id)
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  createMeetup(@Body() dto: CreateMeetupUntransformedDto){ 
    const data = { name:dto.name,

      description:dto.description,

      tegs:dto.tegs,
      time: new Date(dto.time),
      place: dto.place}
    return this.meetupService.createMeetup(data)
  }

  @Put('change/:id')
  changeMeetupInfo(@Param('id',ParseIntPipe) id:number, @Body() dto: CreateMeetupUntransformedDto){
    const data = { name:dto.name,

      description:dto.description,

      tegs:dto.tegs,
      time: new Date(dto.time),
      place: dto.place}
    return this.meetupService.updateMeetup({id,data:data})
  }

  @Delete('delete/:id')
  deleteMeetup(@Param('id',ParseIntPipe) id:number){
    return this.meetupService.deleteMeetup(id)
  }
}
