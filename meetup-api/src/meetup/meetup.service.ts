import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import { empty } from '@prisma/client/runtime';
import { DatabaseService } from 'src/database/database.service';
import { CreateMeetupDto } from 'src/meetup/dto/createMeetup.dto';

@Injectable()
export class MeetupService {
  constructor(private readonly databaseService: DatabaseService) {}

  getMeetups = async (): Promise<Meetup[]> => {
    const res = await this.databaseService.meetup.findMany();
    if (!res) {
      throw new NotFoundException(`Meetups not found`);
    }
    return res;
  };

  getMeetupById = async (id: number): Promise<Meetup> => {
    //throw new NotFoundException(`Meetup with ID ${id} not found`); 
    const res = await this.databaseService.meetup.findUnique({
      where: { id: id },
    }); 
    console.log(res)
    if (!res) {
      throw new NotFoundException(`Meetup with ID ${id} not found`);
    }
    return res;
  };

  createMeetup = async (data: CreateMeetupDto): Promise<Meetup> => {
    const res = await this.databaseService.meetup.create({ data });
    if (!res) throw new HttpException("can't create meetup", 409);
    return res;
  };

  updateMeetup = async (params: {
    id: number;
    data: CreateMeetupDto;
  }): Promise<Meetup> => {
    const { id, data } = params;
    const res = await this.databaseService.meetup.update({
      data: data,
      where: { id: id },
    });
    if (!res) throw new HttpException("can't update meetup", 409);
    return res;
  };

  deleteMeetup = async (id: number): Promise<Meetup> => {
    const res = await this.databaseService.meetup.delete({
      where: { id: id },
    });
    if (!res) throw new HttpException("can't delete meetup", 409);

    return res;
  };
}
