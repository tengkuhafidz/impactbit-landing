import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'organisation',
  title: 'Organisation',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Organisation ID',
      type: 'slug',
      description: 'Unique identifier for the organisation',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'name',
      title: 'Organisation Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the organisation'
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Organisation website URL'
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Organisation logo',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: Rule => Rule.email()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Physical address of the organisation'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'logo'
    }
  }
})