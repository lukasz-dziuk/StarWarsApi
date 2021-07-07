import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EpisodesEnum } from "../enums/episodes.enum";

export class GetCharacterResponseDto {
    @ApiProperty({
        type: String,
        description: 'Character id',
        example: '60d86a24dd13163b00e580c9'
    })
    readonly id: string

    @ApiProperty({
        type: String,
        description: 'Character name',
        example: 'Luke'
    })
    readonly name: string

    @ApiProperty({
        enum: EpisodesEnum,
        type: String,
        isArray: true,
        description: 'Episodes where character appears',
        example: ['A_NEW_HOPE', 'THE_EMPIRE_STRIKES_BACK']
    })
    readonly episodes: EpisodesEnum[]

    @ApiPropertyOptional({
        type: String,
        description: 'Planet where character comes from',
        example: 'Agamar'
    })
    readonly planet?: string
}