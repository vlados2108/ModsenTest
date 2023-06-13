import { IsDate, IsString } from "class-validator";

export class CreateUntransformedDto{
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