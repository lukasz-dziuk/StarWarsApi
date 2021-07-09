import { ApiPropertyOptional } from "@nestjs/swagger"

export class InsertCharacterResponseDto {
    @ApiPropertyOptional({
        type: String,
        description: `newly created character's Id`,
        example: '60d86a24dd13163b00e580c9'
    })
    readonly characterId: string
}