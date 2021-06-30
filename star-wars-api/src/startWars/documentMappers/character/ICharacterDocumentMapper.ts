import { ICharacter } from "../../interfaces/ICharacter";
import { ICharacterDocument } from "../../interfaces/ICharacter.document";
import { IDocumentMapper } from "../IDocumentMapper";

export interface ICharacterDocumentMapper extends IDocumentMapper<ICharacterDocument, ICharacter> {
}