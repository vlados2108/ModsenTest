import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto{
    @IsString()
    @ApiProperty()
    username:string;

    @IsString()
    @ApiProperty()
    password:string;
}