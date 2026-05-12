import {IsString, IsNumber, Min, IsIn} from "class-validator"

export class CreateJobDto {
    @IsString()
    @IsIn(["wish1", "wish2", "wish3", "wish4", "wish5"])
    wish: string;

    @IsNumber()
    @Min(1)
    value: number;
}