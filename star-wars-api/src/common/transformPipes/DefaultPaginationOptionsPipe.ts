import { Injectable, PipeTransform } from '@nestjs/common'
import { IPaginationOptions } from 'src/startWars/interfaces/IPaginationOptions'

@Injectable()
export class DefaultPaginationOptionsPipe implements PipeTransform<any, string> {
    constructor(private readonly paginationOptions?: Partial<IPaginationOptions>) { }
    transform(value: any): any {
        value.limit = value.limit ?? (this.paginationOptions?.limit ?? 10)
        value.page = value.page ?? (this.paginationOptions?.page ?? 1)
        return value
    }
}