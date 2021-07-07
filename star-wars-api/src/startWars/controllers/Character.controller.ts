import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCharacterListRequestDto } from "../dtos/GetCharacterListRequest.dto";
import { InsertCharacterRequestDto } from "../dtos/InsertCharacterRequest.dto";
import { UpdateCharacterRequestDto } from "../dtos/UpdateCharacterRequest.dto";
import { injectToken } from "../injectToken";
import { ICharacterInsertModel } from "../interfaces/ICharacterInsertModel";
import { ICharacterUpdatetModel } from "../interfaces/ICharacterUpdateModel";
import { IPaginationOptions } from "../interfaces/IPaginationOptions";
import { ICharacterService } from "../services/characterService/ICharacterService";
import { GetCharacterListResponseDto } from "../dtos/GetCharacterListResponse.dto";
import { GetCharacterResponseDto } from "../dtos/GetCharacteResponse.dto";
import { ValidateObjectIdPipe } from "../../common/transformPipes/ValidateObjectIdPipe";
import { InsertCharacterResponseDto } from "../dtos/InsertCharacterResponse.dto";
import { ICharacter } from "../interfaces/ICharacter";
import { ICharacterDtoMapper } from "../dtoMappers/character/ICharacterDtoMapper";
import { IPagination } from "../interfaces/IPagination";
import { GetCharactersFilter } from "../queryFilters/getCharactersFilter";
import { DefaultPaginationOptionsPipe } from "../../common/transformPipes/DefaultPaginationOptionsPipe";

@ApiTags('StarWars')
@Controller('character')
export class CharacterController {
    constructor(
        @Inject(injectToken.services.ICharacterService) private _characterService: ICharacterService,
        @Inject(injectToken.dtoMappers.ICharacterDtoMapper) private _characterDtoMapper: ICharacterDtoMapper) { }

    @ApiOkResponse({ description: 'Character list has been successfully returned.', type: GetCharacterListResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid Request', type: GetCharacterResponseDto })
    @UsePipes(new DefaultPaginationOptionsPipe())
    @Get()
    public async getCharacterList(
        @Query() getCharacterListRequestDto: GetCharacterListRequestDto,
    ): Promise<GetCharacterListResponseDto> {
        const IPaginationOptions: IPaginationOptions = {
            limit: getCharacterListRequestDto.limit,
            page: getCharacterListRequestDto.page
        }

        const getCharactersFilter: GetCharactersFilter = {
            name: getCharacterListRequestDto.name,
            episodes: getCharacterListRequestDto.episodes,
            planet: getCharacterListRequestDto.planet
        }

        const paginatedCharacters: IPagination<ICharacter> =
            await this._characterService.getCharacters(IPaginationOptions, getCharactersFilter)

        return this._characterDtoMapper.mapGetCharacterListResponseDto(paginatedCharacters)
    }

    @ApiOkResponse({ description: 'Character list has been successfully returned.', type: GetCharacterResponseDto })
    @ApiBadRequestResponse({ description: 'Invalid id', type: GetCharacterResponseDto })
    @ApiNotFoundResponse({ description: `Character for the given id doesn't exists` })
    @ApiParam({ name: 'id', type: String })
    @Get('/:id')
    public async getCharacterById(
        @Param('id', new ValidateObjectIdPipe) characterId: string,
    ): Promise<GetCharacterResponseDto | string> {
        const character: ICharacter | null = await this._characterService.getCharacterById(characterId)

        if (character) {
            const getCharacterResponseDto: GetCharacterResponseDto =
                this._characterDtoMapper.mapGetCharacterResponseDto(character)
            return getCharacterResponseDto;
        }

        throw new HttpException(`Character for the id ${characterId} is not found`, HttpStatus.NOT_FOUND)
    }

    @ApiCreatedResponse({ description: 'Character id of new character', type: InsertCharacterRequestDto })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @Post('')
    public async insertCharacter(
        @Body() insertCharacterBody: InsertCharacterRequestDto,
    ): Promise<InsertCharacterResponseDto> {
        const newCharacter: ICharacterInsertModel = {
            name: insertCharacterBody.name,
            episodes: insertCharacterBody.episodes,
            planet: insertCharacterBody.planet
        }

        const characterId: string = await this._characterService.insertCharacter(newCharacter)

        return this._characterDtoMapper.mapInsertCharacterResponseDto(characterId)
    }

    @ApiResponse({ status: 204, description: 'Character successfully updated' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiNotFoundResponse({ description: `Character for the given id doesn't exists` })
    @HttpCode(204)
    @ApiParam({ name: 'id', type: String })
    @Patch(':id')
    public async updateCharacter(
        @Body() updateCharacterRequestDto: UpdateCharacterRequestDto,
        @Param('id', new ValidateObjectIdPipe) characterId: string,
    ): Promise<void> {
        const updateCharacterModel: ICharacterUpdatetModel = {
            name: updateCharacterRequestDto.name,
            episodes: updateCharacterRequestDto.episodes,
            planet: updateCharacterRequestDto.planet
        }

        await this._characterService.updateCharacter(updateCharacterModel, characterId)
    }

    @ApiResponse({ status: 204, description: 'Character successfully deleted' })
    @ApiNotFoundResponse({ description: `Character for the given id doesn't exists` })
    @HttpCode(204)
    @ApiParam({ name: 'id', type: String })
    @Delete(':id')
    public async deleteCharacter(
        @Param('id', new ValidateObjectIdPipe) characterId: string,
    ): Promise<void> {
        await this._characterService.deleteCharacter(characterId)
    }
}

