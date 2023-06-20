import { IsNumber, IsString } from "class-validator";

export class FilterDto{

    @IsString()
    search:string

    @IsString()
    filterLow:string

    @IsString()
    filterHigh:string

    @IsString()
    sort:string

    @IsNumber()
    page: number

    @IsNumber()
    perPage: number
}