import { ICharacterService } from './ICharacterService';

export const CharacterServiceMock: ICharacterService = {
    getCharacters: jest.fn(),
    getCharacterById: jest.fn(),
    updateCharacter: jest.fn(),
    insertCharacter: jest.fn(),
    deleteCharacter: jest.fn()
};
