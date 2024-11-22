import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUploadDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title : string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description : string;
}
