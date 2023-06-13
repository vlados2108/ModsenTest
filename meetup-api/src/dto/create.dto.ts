import { IsDate, IsNumber, IsString } from "class-validator";
import { isDate } from "util/types";

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