import { ApiProperty } from "@nestjs/swagger"
import { GetCharacterResponseDto } from "./GetCharacteResponse.dto"


export class GetCharacterListResponseDto {
    @ApiProperty({
        type: GetCharacterResponseDto,
        isArray: true,
        description: 'Episodes where character appears',
        example: [
            {
                "id": "60d86a24dd13163b00e580c9",
                "name": "Luke",
                "episodes": [
                    "A_NEW_HOPE",
                    "THE_EMPIRE_STRIKES_BACK"
                ],
                "planet": "Agamar"
            },
            {
                "id": "60d86a78c119091678a58370",
                "name": "Darth Vader",
                "episodes": [
                    "A_NEW_HOPE"
                ],
                "planet": "Agamar"
            },
        ]
    })
    readonly data: GetCharacterResponseDto[]

    @ApiProperty({
        type: Number,
        description: 'The Page number',
        example: 1
    })
    readonly page: number

    @ApiProperty({
        type: Number,
        description: 'The limit of results per page',
        example: 10
    })
    readonly limit: number

    @ApiProperty({
        type: Number,
        description: 'The Last page',
        example: 1
    })
    readonly lastPage: number

    @ApiProperty({
        type: Boolean,
        description: 'The flag for checking if the list has a previous page',
        example: false
    })
    readonly hasPrevPage: boolean

    @ApiProperty({
        type: Boolean,
        description: 'The flag for checking if the list has a next page',
        example: false
    })
    readonly hasNextPage: boolean

    @ApiProperty({
        type: Boolean,
        description: 'Total number of items of the list',
        example: 2
    })
    readonly totalItems: number
}