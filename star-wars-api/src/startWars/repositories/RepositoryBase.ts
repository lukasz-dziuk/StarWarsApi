import { FilterQuery, Model as RepositoryModel, Document } from "mongoose";
import { MathHelper } from "../../common/helpers/mathHelper/MathHelper";
import { IPagination } from "../interfaces/IPagination";
import { IPaginationOptions } from "../interfaces/IPaginationOptions";
import { IRepositoryBase } from "./IRepositoryBase";
export abstract class RepositoryBase<TDocument extends Document> implements IRepositoryBase<TDocument> {
    public async paginate(
        model: RepositoryModel<TDocument>,
        paginationOptions: IPaginationOptions,
        findConditions?: FilterQuery<TDocument>): Promise<IPagination<TDocument>> {
        const totalResultsCount: number = await model.find(findConditions).countDocuments();
        const { limit, page } = paginationOptions;
        const offset: number = (page - 1) * limit;
        const lastPage: number = this.calculateLastPage(totalResultsCount, limit)
        const results: TDocument[] = await model
            .find(findConditions)
            .skip(offset)
            .limit(limit)

        return {
            data: results,
            page,
            limit,
            lastPage,
            hasPrevPage: page > 1,
            hasNextPage: lastPage > page,
            totalItems: totalResultsCount,
        };
    }

    private calculateLastPage(totalResultsCount: number, limit: number) {
        if (totalResultsCount % limit === 0) {
            return MathHelper.nearestValue(totalResultsCount / limit)
        }

        return MathHelper.integerValue(totalResultsCount / limit) + 1
    }
}