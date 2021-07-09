import { Document } from 'mongoose'
import { EpisodesEnum } from '../enums/episodes.enum'

export interface ICharacterDocument extends Document {
    name: string
    episodes: EpisodesEnum[]
    planet?: string
}
