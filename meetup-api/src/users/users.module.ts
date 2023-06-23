import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsersService,DatabaseService,JwtService],
  exports:[UsersModule,UsersService],
  imports:[]
})
export class UsersModule {}
