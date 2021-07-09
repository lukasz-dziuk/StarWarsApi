import { ICharacterDocument } from "src/startWars/interfaces/ICharacter.document"
import { GetCharactersFilter } from "src/startWars/queryFilters/getCharactersFilter"
import { ICharacter } from "../../interfaces/ICharacter"
import { ICharacterInsertModel } from "../../interfaces/ICharacterInsertModel"
import { ICharacterUpdatetModel } from "../../interfaces/ICharacterUpdateModel"
import { IPagination } from "../../interfaces/IPagination"
import { IPaginationOptions } from "../../interfaces/IPaginationOptions"
import { IRepositoryBase } from "../IRepositoryBase"

export interface ICharacterRepository extends IRepositoryBase<ICharacterDocument> {
    getCharacters(paginationOptions: IPaginationOptions, filter?: GetCharactersFilter): Promise<IPagination<ICharacter>>
    getCharacterById(characterId: string): Promise<ICharacter>
    updateCharacter(character: ICharacterUpdatetModel, characterId: string): Promise<void>
    insertCharacter(character: ICharacterInsertModel): Promise<string>
    deleteCharacter(characterId: string): Promise<void>
}