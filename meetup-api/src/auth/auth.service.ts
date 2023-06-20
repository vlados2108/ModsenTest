import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { ConfigService } from '@nestjs/config';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
      private usersService: UsersService,
      private jwtService: JwtService,
      private configService: ConfigService
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
    
    public getCookieWithJwtAccessToken(id: number) {
      const payload = {id}
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('secretKey'),
        expiresIn: `${this.configService.get('accessExpiresIn')}s`
      });
      return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('accessExpiresIn')}`;
    }
   
    public getCookieWithJwtRefreshToken(id: number) {
      const payload = {id}
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('refreshSecret'),
        expiresIn: `${this.configService.get('refreshExpiresIn')}s`
      });
      const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('refreshExpiresIn')}`;
      return {
        cookie,
        token
      }
    }


    public getCookiesForLogOut() {
      return [
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0'
      ];
    }

    login = async (user:User): Promise<{access_token:string}> => {
      const payload = {username: user.name,sub:user.id}
  
      return{
        access_token: this.jwtService.sign(payload)
      }
    }
}
