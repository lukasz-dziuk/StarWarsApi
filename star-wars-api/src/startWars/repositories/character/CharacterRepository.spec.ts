import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CharacterDocumentMapper } from "../../documentMappers/character/CharacterDocumentMapper";
import { injectToken } from "../../injectToken";
import { ICharacterRepository } from "../../repositories/character/ICharacterRepository";
import { CharacterRepository } from "./CharacterRepository";
import { ICharacterDocument } from "../../interfaces/ICharacter.document";
import { EpisodesEnum } from "../../enums/episodes.enum";
import { IPaginationOptions } from "../../interfaces/IPaginationOptions";
import { GetCharactersFilter } from "../../queryFilters/getCharactersFilter";
import { FilterQuery, Model as RepositoryModel } from "mongoose";
import { ICharacter } from "src/startWars/interfaces/ICharacter";
import { IPagination } from "src/startWars/interfaces/IPagination";
import { ICharacterUpdatetModel } from "src/startWars/interfaces/ICharacterUpdateModel";
import { NotFoundException } from "@nestjs/common";
import { ICharacterInsertModel } from "src/startWars/interfaces/ICharacterInsertModel";

describe('CharacterRepository', () => {
    interface IRepositoryModelFunctions {
        findById: jest.Mock,
        find: jest.Mock,
        save: jest.Mock,
        countDocuments: jest.Mock,
        skip: jest.Mock,
        limit: jest.Mock,
        create: jest.Mock,
        deleteOne: jest.Mock
    }
    let characterRepositoryModel: IRepositoryModelFunctions
    let characterRepository: ICharacterRepository

    beforeEach(async () => {
        jest.resetAllMocks();
        const dbModelMock: IRepositoryModelFunctions =
        {
            findById: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            countDocuments: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn()
        }

        const mockModule: TestingModule = await Test.createTestingModule(
            {
                providers: [
                    {
                        provide: getModelToken('Character'),
                        useValue: { ...dbModelMock },
                    },
                    {
                        provide: injectToken.repositories.ICharacterRepository,
                        useClass: CharacterRepository,
                    },
                    {
                        provide: injectToken.documentMappers.ICharacterDocumentMapper,
                        useClass: CharacterDocumentMapper,
                    },
                ],
            },
        ).compile()
        characterRepositoryModel = mockModule.get(getModelToken('Character'));
        characterRepository = mockModule.get(injectToken.repositories.ICharacterRepository);
    });

    describe('getCharacterById', () => {
        const characterId: string = '60dc4b85ca59964044f14eb8'
        const characterDocument: ICharacterDocument = (({
            id: characterId,
            name: 'Luke',
            episodes: [EpisodesEnum.ATTACK_OF_THE_CLONES],
            planet: 'Anoat',
        }) as unknown) as ICharacterDocument

        it('characterRepositoryModel.findById shold be called with valid data', async () => {
            await characterRepository.getCharacterById(characterId);

            expect(characterRepositoryModel.findById).toBeCalledWith(characterId);
        });

        it('characterRepository.getCharacterById shold return valid data', async () => {
            jest.spyOn(characterRepositoryModel, 'findById').mockResolvedValueOnce(characterDocument);

            const result = await characterRepository.getCharacterById(characterId);

            expect(result).toEqual(characterDocument);
        });
    });

    describe('getCharacters', () => {
        const paginationOptions: IPaginationOptions = {
            limit: 5,
            page: 2
        }
        const getCharactersFilter: GetCharactersFilter = {
            name: 'Luke',
            episodes: [
                EpisodesEnum.ATTACK_OF_THE_CLONES,
                EpisodesEnum.REVENGE_OF_THE_SITH],
        }
        const mappedGetCharactersFilter: FilterQuery<RepositoryModel<ICharacterDocument>> = {
            name: { $regex: getCharactersFilter.name, $options: 'i' },
            episodes: { $in: getCharactersFilter.episodes }
        }
        const characterId: string = '60dc4b85ca59964044f14eb8'
        const characterIdTwo: string = '60dc4b85ca59964044f14eb9'
        const characterResults: ICharacter[] = [{
            id: characterId,
            name: 'Luke',
            episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
            planet: 'Abafar'
        },
        {
            id: characterIdTwo,
            name: 'Mas Amedda',
            episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
            planet: 'Akiva'
        }]
        const characterDocumentsResult: ICharacterDocument[] = (characterResults as unknown) as ICharacterDocument[]
        const mappedPaginatedResponseData: IPagination<ICharacter> = {
            data: characterResults,
            page: 1,
            limit: 10,
            lastPage: 1,
            hasPrevPage: false,
            hasNextPage: false,
            totalItems: 2,
        }
        const paginateResult: IPagination<ICharacterDocument> = {
            ...mappedPaginatedResponseData,
            data: characterDocumentsResult,
        }

        it('characterRepository.paginate shold be called with valid data', async () => {

            jest.spyOn(characterRepositoryModel, 'find').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'countDocuments').mockResolvedValueOnce(1);
            jest.spyOn(characterRepositoryModel, 'find').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'skip').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'limit').mockReturnValueOnce(characterDocumentsResult);
            jest.spyOn(characterRepository, 'paginate').mockResolvedValueOnce(paginateResult);
            await characterRepository.getCharacters(paginationOptions, getCharactersFilter);

            expect(characterRepository.paginate)
                .toBeCalledWith(characterRepositoryModel, paginationOptions, mappedGetCharactersFilter);
        });

        it('characterRepository.getCharacters shold return valid data', async () => {
            jest.spyOn(characterRepositoryModel, 'find').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'countDocuments').mockResolvedValueOnce(1);
            jest.spyOn(characterRepositoryModel, 'find').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'skip').mockReturnValueOnce(characterRepositoryModel);
            jest.spyOn(characterRepositoryModel, 'limit').mockReturnValueOnce(characterDocumentsResult);
            jest.spyOn(characterRepository, 'paginate').mockResolvedValueOnce(paginateResult);

            const results: IPagination<ICharacter> =
                await characterRepository.getCharacters(paginationOptions, getCharactersFilter);

            expect(results)
                .toEqual(paginateResult);
        });
    });

    describe('updateCharacter', () => {
        const characterUpdatetModel: ICharacterUpdatetModel = {
            name: 'Luke',
            episodes: [
                EpisodesEnum.A_NEW_HOPE,
                EpisodesEnum.REVENGE_OF_THE_SITH],
            planet: 'Anoat'
        }
        const characterId: string = '60dc4b85ca59964044f14eb8'

        it('characterRepositoryModel.updateCharacter shold throw NotFoundException when character is not found', async () => {
            jest.spyOn(characterRepositoryModel, 'findById').mockReturnValueOnce(null);

            await expect(characterRepository.updateCharacter(characterUpdatetModel, characterId))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('insertCharacter', () => {
        const characterId: string = '60dc4b85ca59964044f14eb8'
        const characterInsertModel: ICharacterInsertModel = {
            name: 'Luke',
            episodes: [
                EpisodesEnum.A_NEW_HOPE,
                EpisodesEnum.THE_LAST_JEDI],
        }
        const characterDocument: ICharacterDocument = (({
            id: characterId,
            name: 'Luke',
            episodes: [
                EpisodesEnum.A_NEW_HOPE,
                EpisodesEnum.THE_LAST_JEDI],
        }) as unknown) as ICharacterDocument

        it('characterRepositoryModel.insertCharacter shold return id of newly created character', async () => {
            jest.spyOn(characterRepositoryModel, 'create').mockResolvedValueOnce(characterDocument)

            const newCharacterId: string = await characterRepository.insertCharacter(characterInsertModel)

            expect(newCharacterId).toEqual(characterId)
        });
    });

    describe('deleteCharacter', () => {
        const characterId: string = '60dc4b85ca59964044f14eb8'

        it('characterRepositoryModel.deleteOne shold be called with valid data', async () => {
            await characterRepository.deleteCharacter(characterId)

            expect(characterRepositoryModel.deleteOne).toBeCalledWith({ _id: characterId })
        });
    });
});