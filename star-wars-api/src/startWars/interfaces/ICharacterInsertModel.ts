import { EpisodesEnum } from "../enums/episodes.enum"

export interface ICharacterInsertModel {
    _id?: string
    name: string
    episodes: EpisodesEnum[]
    planet?: string
}