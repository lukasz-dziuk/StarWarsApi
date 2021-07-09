import { ClassProvider, Module } from "@nestjs/common"
import { injectToken } from "../injectToken"
import { CharacterDocumentMapper } from "./character/CharacterDocumentMapper"


const providers: ClassProvider[] = [
    {
        provide: injectToken.documentMappers.ICharacterDocumentMapper,
        useClass: CharacterDocumentMapper
    }
]

@Module({
    providers: providers,
    exports: providers.map((provider: ClassProvider) => provider.provide)
})

export class DocumentMapperModule { }