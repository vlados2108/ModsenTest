import { Injectable, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from '@prisma/client';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService
      ) {}

    saltRounds = 10;

    validateUser = async (username: string, pass: string): Promise<any> => {
        const user = await this.usersService.getUser(username);
        
        const validPassword = bcrypt.compareSync(pass, user.password);
        if (user && validPassword) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
    
    login = async (user:User): Promise<{access_token:string}> => {
      const payload = {username: user.name,sub:user.id}
  
      return{
        access_token: this.jwtService.sign(payload)
      }
    }
}
