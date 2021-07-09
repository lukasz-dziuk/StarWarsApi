import { GetCharacterResponseDto } from "src/startWars/dtos/GetCharacteResponse.dto"
import { GetCharacterListResponseDto } from "src/startWars/dtos/GetCharacterListResponse.dto"
import { InsertCharacterResponseDto } from "src/startWars/dtos/InsertCharacterResponse.dto"
import { ICharacter } from "src/startWars/interfaces/ICharacter"
import { IPagination } from "src/startWars/interfaces/IPagination"

export interface ICharacterDtoMapper {
    mapInsertCharacterResponseDto(characterId: string): InsertCharacterResponseDto
    mapGetCharacterResponseDto(character: ICharacter): GetCharacterResponseDto
    mapGetCharacterListResponseDto(paginatedCharacters: IPagination<ICharacter>): GetCharacterListResponseDto
}