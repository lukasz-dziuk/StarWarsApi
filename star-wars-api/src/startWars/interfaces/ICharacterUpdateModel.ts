import { InsertCharacterRequestDto } from "../dtos/InsertCharacterRequest.dto";

export interface ICharacterUpdatetModel extends Partial<Omit<InsertCharacterRequestDto, 'id'>> { }