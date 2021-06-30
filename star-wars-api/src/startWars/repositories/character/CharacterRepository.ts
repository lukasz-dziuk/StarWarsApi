import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model as RepositoryModel } from "mongoose";
import { injectToken } from "../../injectToken";
import { ICharacter } from "../../interfaces/ICharacter";
import { ICharacterInsertModel } from "../../interfaces/ICharacterInsertModel";
import { IPagination } from "../../interfaces/IPagination";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { ICharacterDocument } from "../../interfaces/ICharacter.document";
import { ICharacterUpdatetModel } from "../../interfaces/ICharacterUpdateModel";
import { modelToken } from "../modelToken";
import { ICharacterRepository } from "./ICharacterRepository";
import { ICharacterDocumentMapper } from "src/startWars/documentMappers/character/ICharacterDocumentMapper";
import { GetCharactersFilter } from "src/startWars/queryFilters/getCharactersFilter";
import { RepositoryBase } from "../RepositoryBase";

@Injectable()
export class CharacterRepository extends RepositoryBase<ICharacterDocument> implements ICharacterRepository {
    constructor(
        @InjectModel(modelToken.Character) private readonly _characterRepositoryModel: RepositoryModel<ICharacterDocument>,
        @Inject(injectToken.documentMappers.ICharacterDocumentMapper) private readonly _characterDocumentMapper: ICharacterDocumentMapper
    ) { super() }


    public async getCharacterById(characterId: string): Promise<ICharacter | null> {
        const characterEntity: ICharacterDocument = await this._characterRepositoryModel.findById(characterId);

        return this._characterDocumentMapper.mapDocumentToModel(characterEntity);
    }

    public async getCharacters(paginationOptions: IPaginationOptions, filter?: GetCharactersFilter): Promise<IPagination<ICharacter>> {
        const paginatedCharacterDocuments: IPagination<ICharacterDocument> =
            await this.paginate(
                this._characterRepositoryModel,
                paginationOptions,
                this.applyGetCharactersFilter(filter))

        return {
            ...paginatedCharacterDocuments,
            data: this._characterDocumentMapper.mapDocumentsToModels(paginatedCharacterDocuments.data)
        }
    }

    public async updateCharacter(character: ICharacterUpdatetModel, characterId: string): Promise<void> {
        const characterToUpdate: ICharacterDocument | null = await this._characterRepositoryModel.findById(characterId);

        if (!characterToUpdate) {
            throw new NotFoundException(`Character with an id "${characterId}" not found`)
        }

        const { name, episodes, planet }: ICharacterUpdatetModel = character

        if (name) {
            characterToUpdate.name = name
        }

        if (episodes) {
            characterToUpdate.episodes = episodes
        }

        if (planet) {
            characterToUpdate.planet = planet
        }

        await characterToUpdate.save()
    }

    public async insertCharacter(character: ICharacterInsertModel): Promise<string> {
        const newCharacter: ICharacterDocument = await this._characterRepositoryModel.create(character)

        return newCharacter.id;
    }

    public async deleteCharacter(characterId: string): Promise<void> {
        await this._characterRepositoryModel.deleteOne({ _id: characterId });
    }

    private applyGetCharactersFilter(filter?: GetCharactersFilter): FilterQuery<RepositoryModel<ICharacterDocument>> | undefined {
        if (!filter) {
            return undefined;
        }

        let filterQuery: FilterQuery<RepositoryModel<ICharacterDocument>> | undefined = {}

        if (filter.name) {
            filterQuery.name = { $regex: filter.name, $options: 'i' }
        }

        if (filter.episodes) {
            filterQuery.episodes = { $in: filter.episodes }
        }
        if (filter.planet) {
            filterQuery.planet = { $regex: filter.planet, $options: 'i' }
        }
        return filterQuery
    }
}