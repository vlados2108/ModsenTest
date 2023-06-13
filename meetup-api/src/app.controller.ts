import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
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

  @UsePipes(new ValidationPipe())
  @Post('create')
  createMeetup(@Body() dto: CreateDto){ 
    return dto
  }

  @Put('change/:id')
  changeMeetupInfo(@Param('id',ParseIntPipe) id:number, @Body() dto: CreateDto){

  }

  @Delete('delete/:id')
  deleteMeetup(@Param('id',ParseIntPipe) id:number){

  }
}
