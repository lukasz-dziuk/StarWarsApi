import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { EpisodesEnum } from "../enums/episodes.enum";

export class GetCharacterListRequestDto {
    @ApiPropertyOptional({
        type: Number,
        description: 'The limit of results per page',
        minimum: 1,
        default: 10
    })
    @IsOptional()
    @Min(1)
    @IsNumber()
    @Type(() => Number)
    readonly limit: number

    @ApiPropertyOptional({
        type: Number,
        description: 'Page number',
        minimum: 1,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    readonly page: number

    @ApiPropertyOptional({
        type: String,
        description: 'Character name',
        example: 'Luke'
    })
    @IsString()
    @IsOptional()
    readonly name?: string

    @ApiPropertyOptional({
        enum: EpisodesEnum,
        type: String,
        isArray: true,
        description: 'Episodes where character appears',
        example: ['A_NEW_HOPE', 'THE_EMPIRE_STRIKES_BACK']
    })
    @IsArray()
    @IsOptional()
    @IsEnum(EpisodesEnum, { each: true })
    @Type(() => String)
    readonly episodes?: EpisodesEnum[]

    @ApiPropertyOptional({
        type: String,
        description: 'Planet where character comes from',
        example: 'Agamar'
    })
    @IsString()
    @IsOptional()
    readonly planet?: string
}