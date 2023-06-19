import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { UserDto } from 'src/users/dto/user.dto';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  getUser = async (username: string): Promise<User> => {
    const user = await this.databaseService.user.findFirst({
      where: { name: username },
    });
    if (!user) throw new NotFoundException('user not found');

    return user;
  };

  createUser = async (data: UserDto): Promise<User> => {
    const hash = bcrypt.hashSync(data.password, 10);
    data.password = hash;
    const res = await this.databaseService.user.create({ data: data });
    if (!res) throw new HttpException(`can't create user}`, 409);
    return res;
  };
}
