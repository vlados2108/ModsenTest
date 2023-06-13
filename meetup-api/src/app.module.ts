import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserService } from './user/user.service';
import { MeetupService } from './meetup/meetup.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService, UserService, MeetupService],
})
export class AppModule {}
