import { ICharacter } from "../interfaces/ICharacter";

export type GetCharactersFilter = Partial<Omit<ICharacter, 'id'>>