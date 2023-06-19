import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserDto } from 'src/users/dto/user.dto';
const bcrypt = require('bcrypt');

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

    createUser = async (data:UserDto):Promise<User> => {
        try{
            const hash = bcrypt.hashSync(data.password,10)
            data.password = hash
            return this.databaseService.user.create({data:data})
        }catch(e){
            throw new HttpException(`can't create user}`,500)
        }
 
    }
}
