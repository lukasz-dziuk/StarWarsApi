import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/startWars/interfaces/IPaginationOptions';
import { IValidateObjectIdPipe } from './IValidateObjectIdPipe';

@Injectable()
export class DefaultPaginationOptionsPipe implements IValidateObjectIdPipe {
    constructor(private readonly paginationOptions?: Partial<IPaginationOptions>) { }
    transform(value: any): any {
        value.limit = value.limit ?? (this.paginationOptions?.limit ?? 10)
        value.page = value.page ?? (this.paginationOptions?.page ?? 1)
        return value
    }
}