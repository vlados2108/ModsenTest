import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import { empty } from '@prisma/client/runtime';
import { DatabaseService } from 'src/database/database.service';
import { CreateMeetupDto } from 'src/meetup/dto/createMeetup.dto';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class MeetupService {
  constructor(private readonly databaseService: DatabaseService) {}

  getMeetups = async (options: FilterDto): Promise<Meetup[]> => {
    const { search, filterLow, filterHigh, sort, page ,perPage } = options;
    let res = await this.databaseService.meetup.findMany({});
    if (search)
      res = res.filter(
        (meetup) =>
          meetup.name.includes(search) ||
          meetup.description.includes(search) ||
          meetup.place.includes(search) ||
          meetup.tegs.includes(search) ||
          meetup.time.toString().includes(search),
      );

    if (filterLow)
      res = res.filter((meetup) => meetup.time > new Date(filterLow));

    if (filterHigh)
      res = res.filter((meetup) => meetup.time < new Date(filterHigh));

    if (sort)
      if (sort == 'asc')
        res.sort((a, b) => {
          if (a.time < b.time) return -1;
          if (a.time > b.time) return 1;
          return 0;
        });
      else if (sort == 'desc')
      res.sort((a, b) => {
        if (a.time < b.time) return 1;
        if (a.time > b.time) return -1;
        return 0;
      });

    if (page && perPage){
      const startIndex = (page-1)*perPage
      const endindex = startIndex + perPage

      res = res.slice(startIndex,endindex)
    }

    if (!res) {
      throw new NotFoundException(`Meetups not found`);
    }
    return res;
  };

  getAllMeetups = async (): Promise<Meetup[]> => {
    const res = await this.databaseService.meetup.findMany({});
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
