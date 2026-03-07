import type {StructureResolver} from 'sanity/structure'

const singletonTypes = new Set(['monthlyUpdate'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Monthly Update')
        .id('monthly-update')
        .child(
          S.document()
            .schemaType('monthlyUpdate')
            .documentId('monthly-update')
        ),
      ...S.documentTypeListItems()
        .filter(listItem => !singletonTypes.has(listItem.getId() || ''))
    ])
