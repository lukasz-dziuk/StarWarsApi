import { ICharacter } from "./ICharacter";

export interface ICharacterUpdatetModel extends Partial<Omit<ICharacter, 'id'>> { }