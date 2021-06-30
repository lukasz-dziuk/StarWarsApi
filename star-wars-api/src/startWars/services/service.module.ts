import { ClassProvider, Module } from "@nestjs/common";
import { injectToken } from "../injectToken";
import { RepositoryModule } from "../repositories/repository.module";
import { CharacterService } from "./characterService/CharacterService";

const providers: ClassProvider[] = [
    {
        provide: injectToken.services.ICharacterService,
        useClass: CharacterService
    },
]

@Module({
    imports: [RepositoryModule],
    providers: providers,
    exports: providers.map((provider: ClassProvider) => provider.provide)
})

export class ServiceModule { }
