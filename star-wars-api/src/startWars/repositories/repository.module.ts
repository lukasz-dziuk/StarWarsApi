import { ClassProvider, Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { injectToken } from "../injectToken";
import { CharacterRepository } from "./character/CharacterRepository";
import { Schemas } from "./schemas";
import { modelToken } from "./modelToken";
import { DocumentMapperModule } from "../documentMappers/documentMapper.module";

const mongooseSchemas: mongooseSchemas[] = [
    { name: modelToken.Character, schema: Schemas.Character }
]

const providers: ClassProvider[] = [
    {
        provide: injectToken.repositories.ICharacterRepository,
        useClass: CharacterRepository
    }
]

@Module({
    imports: [
        MongooseModule.forFeature(mongooseSchemas),
        DocumentMapperModule],
    providers: providers,
    exports: providers.map((provider: ClassProvider) => provider.provide)
})
export class RepositoryModule { }

interface mongooseSchemas {
    name: string,
    schema: mongoose.Schema,
}