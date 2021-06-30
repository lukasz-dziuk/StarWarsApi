import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { IValidateObjectIdPipe } from './IValidateObjectIdPipe';

@Injectable()
export class ValidateObjectIdPipe implements IValidateObjectIdPipe {
    transform(value: any): string {
        const validObjectId = Types.ObjectId.isValid(value);

        if (!validObjectId) {
            throw new BadRequestException('Invalid ObjectId');
        }

        return value;
    }
}