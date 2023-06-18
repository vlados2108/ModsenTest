import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [UsersService,DatabaseService],
  exports:[UsersModule,UsersService],
  imports:[]
})
export class UsersModule {}
