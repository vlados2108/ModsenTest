import { Injectable } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateDto } from 'src/dto/create.dto';

@Injectable()
export class MeetupService {
    constructor(private readonly databaseService: DatabaseService){}

    getMeetups = async ():Promise<Meetup[]> => {
        return this.databaseService.meetup.findMany()
    }

    getMeetup = async (id:number):Promise<Meetup> => {
        return this.databaseService.meetup.findUnique({
            where:{id:id}
        })
    }

    createMeetup = async (data:CreateDto): Promise<Meetup> => {
        return this.databaseService.meetup.create({data})
    }

    updateMeetup = async (params:{id:number,data:CreateDto}):Promise<Meetup> => {
        const {id,data} = params
        return this.databaseService.meetup.update({
            data:data,
            where:{id:id}
        })
    }

    deleteMeetup = async (id:number): Promise<Meetup> => {
        return this.databaseService.meetup.delete({
            where: {id:id}
        })
    }
}
