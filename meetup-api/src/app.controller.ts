import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';
import { MeetupService } from './meetup/meetup.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private readonly meetupService: MeetupService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
  createMeetup(@Body() dto: CreateDto){ 
    return this.meetupService.createMeetup(dto)
  }

  @Put('change/:id')
  changeMeetupInfo(@Param('id',ParseIntPipe) id:number, @Body() dto: CreateDto){
    return this.meetupService.updateMeetup({id,data:dto})
  }

  @Delete('delete/:id')
  deleteMeetup(@Param('id',ParseIntPipe) id:number){
    return this.meetupService.deleteMeetup(id)
  }
}
