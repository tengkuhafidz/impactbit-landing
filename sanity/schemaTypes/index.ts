import { type SchemaTypeDefinition } from 'sanity'
import campaign from './campaign'
import organisation from './organisation'
import monthlyUpdate from './monthlyUpdate'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [campaign, organisation, monthlyUpdate],
}
