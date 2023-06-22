import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserDto{
    @IsString()
    @ApiProperty()
    name:string;

    @IsString()
    @ApiProperty()
    password:string;
}