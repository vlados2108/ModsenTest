import { IsDate, IsString } from "class-validator";

export class CreateDto{
    @IsString()
    name:string;

    @IsString()
    description:string;

    @IsString()
    tegs:string;

    @IsDate()
    time: Date;

    @IsString()
    place: string;
}