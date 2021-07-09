import { Test, TestingModule } from "@nestjs/testing"
import { ICharacterInsertModel } from "src/startWars/interfaces/ICharacterInsertModel"
import { ICharacterUpdatetModel } from "src/startWars/interfaces/ICharacterUpdateModel"
import { EpisodesEnum } from "../../enums/episodes.enum"
import { injectToken } from "../../injectToken"
import { IPaginationOptions } from "../../interfaces/IPaginationOptions"
import { GetCharactersFilter } from "../../queryFilters/getCharactersFilter"
import { CharacterRepositoryMock } from "../../repositories/character/CharacterRepository.mock"
import { ICharacterRepository } from "../../repositories/character/ICharacterRepository"
import { CharacterService } from "./CharacterService"
import { ICharacterService } from "./ICharacterService"

describe('CharacterService', () => {
    let characterService: ICharacterService
    let characterRepository: ICharacterRepository

    beforeEach(async () => {
        jest.resetAllMocks()

        const mockModule: TestingModule = await Test.createTestingModule(
            {
                providers: [
                    {
                        provide: injectToken.repositories.ICharacterRepository,
                        useValue: { ...CharacterRepositoryMock },
                    },
                    {
                        provide: injectToken.services.ICharacterService,
                        useClass: CharacterService,
                    },
                ],
            },
        ).compile()

        characterService = mockModule.get(injectToken.services.ICharacterService)
        characterRepository = mockModule.get(injectToken.repositories.ICharacterRepository)
    })

    describe('getCharacters', () => {
        const characterId: string = '60dc4b85ca59964044f14eb8'

        it('characterRepository.getCharacters shold be called with valid data', async () => {
            const paginationOptions: IPaginationOptions = {
                limit: 5,
                page: 2
            }
            const getCharactersFilter: GetCharactersFilter = {
                name: 'Luke',
                episodes: [
                    EpisodesEnum.ATTACK_OF_THE_CLONES,
                    EpisodesEnum.REVENGE_OF_THE_SITH],
                planet: 'Anaxes'
            }
            await characterService.getCharacters(paginationOptions, getCharactersFilter)

            expect(characterRepository.getCharacters).toBeCalledWith(paginationOptions, getCharactersFilter)
        })

        it('characterRepository.getCharacterById shold be called with valid data', async () => {
            await characterService.getCharacterById(characterId)

            expect(characterRepository.getCharacterById).toBeCalledWith(characterId)
        })

        it('characterRepository.updateCharacter shold be called with valid data', async () => {
            const characterUpdatetModel: ICharacterUpdatetModel = {
                name: 'Luke',
                episodes: [
                    EpisodesEnum.A_NEW_HOPE,
                    EpisodesEnum.REVENGE_OF_THE_SITH],
                planet: 'Anoat'
            }
            await characterService.updateCharacter(characterUpdatetModel, characterId)

            expect(characterRepository.updateCharacter).toBeCalledWith(characterUpdatetModel, characterId)
        })

        it('characterRepository.insertCharacter shold be called with valid data', async () => {
            const characterInsertModel: ICharacterInsertModel = {
                name: 'Luke',
                episodes: [
                    EpisodesEnum.A_NEW_HOPE,
                    EpisodesEnum.THE_LAST_JEDI],
            }
            await characterService.insertCharacter(characterInsertModel)

            expect(characterRepository.insertCharacter).toBeCalledWith(characterInsertModel)
        })

        it('characterRepository.deleteCharacter shold be called with valid data', async () => {
            await characterService.deleteCharacter(characterId)

            expect(characterRepository.deleteCharacter).toBeCalledWith(characterId)
        })
    })
})