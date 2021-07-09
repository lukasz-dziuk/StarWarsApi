import { Document } from 'mongoose'

export interface IDocumentMapper<TDocument extends Document, TModel> {
    mapDocumentToModel(document: TDocument): TModel | null

    mapDocumentsToModels(documents: TDocument[]): TModel[] | null
}