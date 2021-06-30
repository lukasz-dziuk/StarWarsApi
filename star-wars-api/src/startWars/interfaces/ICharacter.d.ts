import { EpisodesEnum } from "../enums/episodes.enum";

export interface ICharacter {
    id: string;
    name: string;
    episodes: EpisodesEnum[];
    planet?: string;
}