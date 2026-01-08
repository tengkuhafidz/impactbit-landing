import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'monthlyUpdate',
  title: 'Monthly Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title for this monthly update',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'text',
      title: 'Monthly Update Text',
      type: 'text',
      description: 'The main content/text for this monthly update',
      rows: 6,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'thumbnail',
      title: 'Monthly Update Thumbnail',
      type: 'image',
      description: 'Thumbnail image for this monthly update',
      options: {
        hotspot: true
      },
    }),
    defineField({
      name: 'date',
      title: 'Update Date',
      type: 'datetime',
      description: 'Date this update was published',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'thumbnail'
    }
  }
})
