import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
const bcrypt = require('bcrypt');


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

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
}
