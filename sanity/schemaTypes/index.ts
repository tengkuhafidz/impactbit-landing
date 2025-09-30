import { type SchemaTypeDefinition } from 'sanity'
import campaign from './campaign'
import organisation from './organisation'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [campaign, organisation],
}
