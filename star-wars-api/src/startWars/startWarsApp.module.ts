import { DynamicModule, Module } from "@nestjs/common"
import { CharacterController } from "./controllers/Character.controller"
import { RepositoryModule } from "./repositories/repository.module"
import { MongooseModule } from "@nestjs/mongoose"
import { ServiceModule } from "./services/service.module"
import * as dotenv from 'dotenv'
import { DtoMapperModule } from "./dtoMappers/dtoMappers.module"

@Module({})
export class StarWarsAppModule {
    static forRoot(useTestDb: boolean): DynamicModule {
        dotenv.config();
        const dbHost: string = useTestDb ? process.env.DB_TEST_HOST : process.env.DB_HOST
        const dbPort: string = useTestDb ? process.env.DB_TEST_PORT : process.env.DB_PORT
        const dbName: string = useTestDb ? process.env.DB_TEST_NAME : process.env.DB_NAME

        return {
            imports: [
                MongooseModule.forRoot(`mongodb://${dbHost}:${dbPort}/${dbName}`),
                RepositoryModule,
                ServiceModule,
                DtoMapperModule],
            controllers: [CharacterController],
            module: StarWarsAppModule
        }
    }
}
