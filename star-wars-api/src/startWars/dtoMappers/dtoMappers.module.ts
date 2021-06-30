import { ClassProvider, Module } from "@nestjs/common";
import { injectToken } from "../injectToken";
import { CharacterDtoMapper } from "./character/CharacterDtoMapper";


const providers: ClassProvider[] = [
    {
        provide: injectToken.dtoMappers.ICharacterDtoMapper,
        useClass: CharacterDtoMapper
    }
]

@Module({
    providers: providers,
    exports: providers.map((provider: ClassProvider) => provider.provide)
})

export class DtoMapperModule { }