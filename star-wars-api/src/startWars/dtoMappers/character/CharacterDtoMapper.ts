import { GetCharacterResponseDto } from "src/startWars/dtos/GetCharacteResponse.dto";
import { GetCharacterListResponseDto } from "src/startWars/dtos/GetCharacterListResponse.dto";
import { InsertCharacterResponseDto } from "src/startWars/dtos/InsertCharacterResponse.dto";
import { ICharacter } from "src/startWars/interfaces/ICharacter";
import { IPagination } from "src/startWars/interfaces/IPagination";
import { ICharacterDtoMapper } from "./ICharacterDtoMapper";

export class CharacterDtoMapper implements ICharacterDtoMapper {
    public mapInsertCharacterResponseDto(characterId: string): InsertCharacterResponseDto {
        return {
            characterId
        }
    }

    public mapGetCharacterResponseDto(character: ICharacter): GetCharacterResponseDto {
        return {
            id: character.id,
            name: character.name,
            episodes: character.episodes,
            planet: character.planet
        }
    }

    public mapGetCharacterListResponseDto(paginatedCharacters: IPagination<ICharacter>): GetCharacterListResponseDto {
        return {
            data: paginatedCharacters.data.map((character: ICharacter): GetCharacterResponseDto => this.mapGetCharacterResponseDto(character)),
            page: paginatedCharacters.page,
            limit: paginatedCharacters.limit,
            lastPage: paginatedCharacters.lastPage,
            hasPrevPage: paginatedCharacters.hasPrevPage,
            hasNextPage: paginatedCharacters.hasNextPage,
            totalItems: paginatedCharacters.totalItems,
        }
    }
}