import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getAllMeetups():any{

  }

  @Get('get/:id')
  getMeetupById(@Param('id',ParseIntPipe)id:number){

  }

  @Post('create')
  createMeetup(@Body() dto: CreateDto){
    return dto
  }

  @Post('change/:id')
  changeMeetupInfo(@Param('id',ParseIntPipe) id:number, @Body() dto: CreateDto){

  }

  @Post('delete/:id')
  deleteMeetup(@Param('id',ParseIntPipe) id:number){

  }
}
