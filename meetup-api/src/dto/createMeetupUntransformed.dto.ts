import { IsDate, IsString } from "class-validator";

export class CreateMeetupUntransformedDto{
    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsString()
    tegs:string;

    @IsString()
    time: string;

    @IsString()
    place: string;
}