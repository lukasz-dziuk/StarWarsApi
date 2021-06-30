import { PipeTransform } from '@nestjs/common';
export interface IValidateObjectIdPipe extends PipeTransform<any, string> {
}