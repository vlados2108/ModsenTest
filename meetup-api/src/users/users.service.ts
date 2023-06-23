import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserDto } from 'src/users/dto/user.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService,private jwtService:JwtService) {}

  getUser = async (username: string): Promise<User> => {
    const user = await this.databaseService.user.findFirst({
      where: { name: username },
    });
    if (!user) throw new NotFoundException('user not found');

    return user;
  };

  getUserById = async (userId: number): Promise<User> => {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  setCurrentRefreshToken  = async (refreshToken:string,userId:number) => {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken,10)
    const res = await this.databaseService.user.update({
      where:{id:userId},
      data:{hashedRefreshToken:currentHashedRefreshToken}
    })
  }

  createUser = async (data: UserDto): Promise<User> => {
    const hash = bcrypt.hashSync(data.password, 10);
    const user = {name:data.name,password:hash,hashedRefreshToken:null}
    data.password = hash;
    const res = await this.databaseService.user.create({ data: user });
    if (!res) throw new HttpException(`can't create user}`, 409);
    return res;
  };

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getUserById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(token: string) {
    const decoded = this.jwtService.decode(token);
    let id = 0;
    if (typeof decoded == 'object') id = decoded.id;
    let user = await this.getUserById(id);
    return this.databaseService.user.update({
      where:{id:user.id},
      data:{hashedRefreshToken:null}
    });
  }
}
