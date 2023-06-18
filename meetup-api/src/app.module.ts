import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MeetupService } from './meetup/meetup.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule,ConfigModule.forRoot({
    isGlobal:true,
    load:[configuration],
  })],
  controllers: [AppController],
  providers: [AppService, UsersService, MeetupService],
})
export class AppModule {}
