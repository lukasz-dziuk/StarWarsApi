import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { StarWarsAppModule } from '../src/startWars/startWarsApp.module';
import { ICharacterDocument } from '../src/startWars/interfaces/ICharacter.document';
import { Model, Types } from 'mongoose';
import { EpisodesEnum } from '../src/startWars/enums/episodes.enum';
import { ICharacterInsertModel } from '../src/startWars/interfaces/ICharacterInsertModel';
import { IPagination } from '../src/startWars/interfaces/IPagination';
import { ICharacter } from '../src/startWars/interfaces/ICharacter';
import { modelToken } from '../src/startWars/repositories/modelToken';

const characterOneId: string = Types.ObjectId().toHexString()
const characterTwoId: string = Types.ObjectId().toHexString()
const characterOne: ICharacterInsertModel = {
  _id: characterOneId,
  name: 'Luke',
  episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
  planet: 'Abafar'
}
const characterTwo: ICharacterInsertModel = {
  _id: characterTwoId,
  name: 'Mas Amedda',
  episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
  planet: 'Akiva'
}

describe('CharacterController (e2e)', () => {
  let app: INestApplication;
  let characterModel: Model<ICharacterDocument>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StarWarsAppModule.forRoot(true)],
      providers: []
    })
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.init();

    characterModel = moduleFixture.get(getModelToken(modelToken.Character));
    await clearCharacterTestData(characterModel)
    await setCharacterTestData(characterModel)
  });

  describe('/character (GET)', () => {
    const paginatedResponseData: IPagination<ICharacter> = {
      data: [{
        id: characterOneId,
        name: 'Luke',
        episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
        planet: 'Abafar'
      },
      {
        id: characterTwoId,
        name: 'Mas Amedda',
        episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
        planet: 'Akiva'
      }],
      page: 1,
      limit: 10,
      lastPage: 1,
      hasPrevPage: false,
      hasNextPage: false,
      totalItems: 2,
    }

    it('/character (GET) should return valid data when no parameter is provided', () => {
      return request(app.getHttpServer())
        .get('/character')
        .expect(200)
        .expect(paginatedResponseData)
    });

    it(`/character (GET) should return data with one element when "limit" parameter equals 1`, () => {
      return request(app.getHttpServer())
        .get('/character')
        .query({ limit: '1' })
        .expect(200)
        .expect((res: Response) => {
          const responseBody: IPagination<ICharacter> = (res.body as unknown) as IPagination<ICharacter>
          if (responseBody?.data?.length !== 1) {
            throw new Error("Wrong data length")
          }
        })
    });

    it('/character (GET) should return status 400 when validation failed', () => {
      return request(app.getHttpServer())
        .get('/character')
        .query({ limit: '10', page: 'invalidPageNumber' })
        .expect(400)
    });
  });

  describe('/character/:id (GET)', () => {
    it('/character/:id (GET) should return characterOne', () => {
      const characterOne: ICharacter = {
        id: characterOneId,
        name: 'Luke',
        episodes: [EpisodesEnum.A_NEW_HOPE, EpisodesEnum.ATTACK_OF_THE_CLONES],
        planet: 'Abafar'
      }
      return request(app.getHttpServer())
        .get(`/character/${characterOneId}`)
        .expect(200)
        .expect(characterOne)
    });

    it('/character/:id (GET) should return status 400 when id is not valid', () => {
      const wrongId: string = 'WRONG_ID'

      return request(app.getHttpServer())
        .get(`/character/${wrongId}`)
        .expect(400)
    });

    it('/character/:id (GET) should return status 404 when character is not found', () => {
      const missingCharacterId: string = Types.ObjectId().toHexString()

      return request(app.getHttpServer())
        .get(`/character/${missingCharacterId}`)
        .expect(404)
    });
  });

  describe('/character (POST)', () => {
    it('/character (POST) should return status 400 when validation failed', () => {
      const invalidNewCharacterRequestBody: any = {
        name: 123,
        episodes: ['invalidEpisode'],
        planet: 567
      }

      return request(app.getHttpServer())
        .post(`/character`)
        .send(invalidNewCharacterRequestBody)
        .expect(400)
    });

    it('/character (POST) should create a new character', async (done) => {
      const newCharacter: Omit<ICharacter, 'id'> = {
        name: 'Han',
        episodes: [EpisodesEnum.THE_RISE_OF_SKYWALKER, EpisodesEnum.THE_FORCE_AWAKENS],
        planet: 'Ando'
      }

      let newCharacterId: string;

      await request(app.getHttpServer())
        .post(`/character`)
        .send(newCharacter)
        .expect(201)
        .expect((res: Response) => {
          const responseBody: { characterId: string } = (res.body as unknown) as { characterId: string }
          const returnedCharacterId: string = responseBody?.characterId
          const isResponseValidObjectId: boolean = Types.ObjectId.isValid(returnedCharacterId)

          if (!isResponseValidObjectId) {
            throw Error('response body must be a valid ObjectId')
          }

          newCharacterId = returnedCharacterId;
        })

      await request(app.getHttpServer())
        .get(`/character/${newCharacterId}`)
        .expect({
          id: newCharacterId,
          ...newCharacter
        })

      return done()
    });
  });

  describe('/character/:id (PATCH)', () => {
    const characterIdForUpdate: string = characterOneId

    it('/character/:id (PATCH) should return status 400 when id is invalid', () => {
      const wrongId: string = 'WRONG_ID'

      return request(app.getHttpServer())
        .patch(`/character/${wrongId}`)
        .expect(400)
    });

    it('/character/:id (PATCH) should return status 400 when request body is invalid', () => {
      const invalidUpdatedCharacterRequestBody: object = {
        name: 123,
        episodes: ['invalidEpisode'],
        planet: 456
      }

      return request(app.getHttpServer())
        .patch(`/character/${characterIdForUpdate}`)
        .send(invalidUpdatedCharacterRequestBody)
        .expect(400)
    });

    it('/character/:id (PATCH) should update character', async (done) => {

      const updatedCharacter: Omit<ICharacter, 'id'> = {
        name: 'Han Updated',
        episodes: [
          EpisodesEnum.THE_RISE_OF_SKYWALKER,
          EpisodesEnum.THE_FORCE_AWAKENS,
          EpisodesEnum.RETURN_OF_THE_JEDI],
        planet: 'Ando Updated'
      }

      await request(app.getHttpServer())
        .patch(`/character/${characterIdForUpdate}`)
        .send(updatedCharacter)
        .expect(204)

      await request(app.getHttpServer())
        .get(`/character/${characterIdForUpdate}`)
        .expect({
          id: characterIdForUpdate,
          ...updatedCharacter
        })

      return done()
    });
  });
  describe('/character/:id (DELETE)', () => {
    it('/character/:id (DELETE) should return status 400 when id is invalid', () => {
      const wrongId: string = 'WRONG_ID'

      return request(app.getHttpServer())
        .delete(`/character/${wrongId}`)
        .expect(400)
    });

    it('/character/:id (DELETE) should delete character', async (done) => {
      const characterIdForDelete: string = characterOneId;

      await request(app.getHttpServer())
        .delete(`/character/${characterIdForDelete}`)
        .expect(204)

      await request(app.getHttpServer())
        .get(`/character/${characterIdForDelete}`)
        .expect(404)

      return done()
    });
  });
});

async function clearCharacterTestData(characterModel: Model<ICharacterDocument>): Promise<void> {
  await characterModel.deleteMany();
}

async function setCharacterTestData(characterModel: Model<ICharacterDocument>) {
  await characterModel.create([characterOne, characterTwo])
}
