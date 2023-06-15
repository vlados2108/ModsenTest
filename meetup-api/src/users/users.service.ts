import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService){}

    getUser = async (username : string):Promise<User> => {
        try{
            return this.databaseService.user.findFirst({
                where:{name:username}
            })
        }catch(e){
            throw new HttpException(`can't find user with name ${username}`,500)
        }
    }
}
