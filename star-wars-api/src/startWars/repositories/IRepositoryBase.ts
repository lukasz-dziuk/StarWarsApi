import { FilterQuery, Model as RepositoryModel, Document } from "mongoose"
import { IPagination } from "../interfaces/IPagination"
import { IPaginationOptions } from "../interfaces/IPaginationOptions"
export interface IRepositoryBase<TDocument extends Document> {
    paginate(
        model: RepositoryModel<TDocument>,
        paginationOptions: IPaginationOptions,
        findConditions?: FilterQuery<TDocument>): Promise<IPagination<TDocument>>
}