import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { EpisodesEnum } from "../enums/episodes.enum";

export class UpdateCharacterRequestDto {
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