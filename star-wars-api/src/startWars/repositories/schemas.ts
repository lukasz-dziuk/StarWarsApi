import * as mongoose from 'mongoose'

export const characterSchema: mongoose.Schema = new mongoose.Schema({
    name: { type: String, required: true },
    episodes: { type: [String], required: true },
    planet: { type: String, required: false }
})

export const Schemas = {
    Character: characterSchema
}
