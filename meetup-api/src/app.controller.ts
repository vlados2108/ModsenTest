import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe,Request } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
import { MeetupService } from './meetup/meetup.service';
import { CreateUntransformedDto } from './dto/createUntransformed.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly meetupService: MeetupService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login (@Request() req){
    return req.user
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
  createMeetup(@Body() dto: CreateUntransformedDto){ 
    const data = { name:dto.name,

      description:dto.description,

      tegs:dto.tegs,
      time: new Date(dto.time),
      place: dto.place}
    return this.meetupService.createMeetup(data)
  }

  @Put('change/:id')
  changeMeetupInfo(@Param('id',ParseIntPipe) id:number, @Body() dto: CreateUntransformedDto){
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
