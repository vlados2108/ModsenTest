import { IsString } from "class-validator";

export class User{
    @IsString()
    name:string;

    @IsString()
    password:string;
}