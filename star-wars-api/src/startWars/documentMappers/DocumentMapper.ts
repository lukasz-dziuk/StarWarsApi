import { IDocumentMapper } from "./IDocumentMapper";
import { Document } from 'mongoose';

export abstract class DocumentMapper<TDocument extends Document, TModel> implements IDocumentMapper<TDocument, TModel> {
    public abstract mapDocumentToModel(document: TDocument): TModel | null;

    public mapDocumentsToModels(documents: TDocument[]): TModel[] | null {
        if (!documents) {
            return null;
        }

        return documents.map((document) => this.mapDocumentToModel(document));
    }
}