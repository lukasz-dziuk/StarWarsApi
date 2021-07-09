import { ICharacter } from "../../interfaces/ICharacter"
import { ICharacterDocument } from "../../interfaces/ICharacter.document"
import { DocumentMapper } from "../DocumentMapper"

export class CharacterDocumentMapper extends DocumentMapper<ICharacterDocument, ICharacter> {
    public mapDocumentToModel(document: ICharacterDocument): ICharacter | null {
        if (!document) {
            return null
        }
        return {
            id: document.id,
            name: document.name,
            episodes: document.episodes,
            planet: document.planet
        }
    }
}