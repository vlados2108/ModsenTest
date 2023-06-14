import { HttpException, Injectable } from '@nestjs/common';
import { Meetup } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateDto } from 'src/dto/create.dto';

@Injectable()
export class MeetupService {
    constructor(private readonly databaseService: DatabaseService){}

    getMeetups = async ():Promise<Meetup[]> => {
        try {
            return this.databaseService.meetup.findMany()
        }catch(e){
            throw new HttpException("can't get meetups",500)
        }
        
    }

    getMeetup = async (id:number):Promise<Meetup> => {
        try{
            return this.databaseService.meetup.findUnique({
                where:{id:id}
            })
        }catch(e){
            throw new HttpException(`can't get meetup with id ${id}`,500)
        }
    }

    createMeetup = async (data:CreateDto): Promise<Meetup> => {
        try{
            return this.databaseService.meetup.create({data})
        }catch(e){
            throw new HttpException("can't create meetup",500)
        }
    }

    updateMeetup = async (params:{id:number,data:CreateDto}):Promise<Meetup> => {
        try{
            const {id,data} = params
            return this.databaseService.meetup.update({
                data:data,
                where:{id:id}
            })
        }catch(e){
            throw new HttpException("can't update meetup",500)
        }
   
    }

    deleteMeetup = async (id:number): Promise<Meetup> => {
        try{
            return this.databaseService.meetup.delete({
                where: {id:id}
            })
        }catch(e){
            throw new HttpException("can't delete meetup",500)
        }
       
    }
}
