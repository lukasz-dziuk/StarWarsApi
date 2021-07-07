import { Injectable, Inject } from "@nestjs/common";
import { GetCharactersFilter } from "src/startWars/queryFilters/getCharactersFilter";
import { injectToken } from "../../injectToken";
import { ICharacter } from "../../interfaces/ICharacter";
import { ICharacterInsertModel } from "../../interfaces/ICharacterInsertModel";
import { ICharacterUpdatetModel } from "../../interfaces/ICharacterUpdateModel";
import { IPagination } from "../../interfaces/IPagination";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { ICharacterRepository } from "../../repositories/character/ICharacterRepository";
import { ICharacterService } from "./ICharacterService";


@Injectable()
export class CharacterService implements ICharacterService {

    constructor(
        @Inject(injectToken.repositories.ICharacterRepository) private readonly _characterRepository: ICharacterRepository
    ) { }

    public async getCharacters(paginationOptions: IPaginationOptions, filter?: GetCharactersFilter): Promise<IPagination<ICharacter>> {
        return this._characterRepository.getCharacters(paginationOptions, filter)
    }

    public async getCharacterById(characterId: string): Promise<ICharacter> {
        const character: ICharacter | null = await this._characterRepository.getCharacterById(characterId)

        return character
    }

    public async updateCharacter(character: ICharacterUpdatetModel, characterId: string): Promise<void> {
        await this._characterRepository.updateCharacter(character, characterId)
    }

    public async insertCharacter(character: ICharacterInsertModel): Promise<string> {
        return await this._characterRepository.insertCharacter(character)
    }

    public async deleteCharacter(characterId: string): Promise<void> {
        await this._characterRepository.deleteCharacter(characterId)
    }
}