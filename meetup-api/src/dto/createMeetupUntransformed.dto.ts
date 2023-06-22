import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class CreateMeetupUntransformedDto{
    @IsString()
    @ApiProperty()
    name:string;

    @IsString()
    @ApiProperty()
    description:string;

    @IsString()
    @ApiProperty()
    tegs:string;

    @IsString()
    @ApiProperty()
    time: string;

    @IsString()
    @ApiProperty()
    place: string;
}