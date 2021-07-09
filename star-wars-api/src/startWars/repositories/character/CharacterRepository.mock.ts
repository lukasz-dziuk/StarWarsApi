import { ICharacterRepository } from './ICharacterRepository';

export const CharacterRepositoryMock: ICharacterRepository = {
    getCharacters: jest.fn(),
    getCharacterById: jest.fn(),
    updateCharacter: jest.fn(),
    insertCharacter: jest.fn(),
    deleteCharacter: jest.fn(),
    paginate: jest.fn()
}
