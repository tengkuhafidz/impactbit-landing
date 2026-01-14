import {defineField, defineType} from 'sanity'

export default defineType({
    name: 'monthlyUpdate',
    title: 'Monthly Update',
    type: 'document',
    fields: [
        defineField({
            name: 'id',
            title: 'ID',
            type: 'string',
            initialValue: 'monthly-update',
            hidden: true,
            readOnly: true
        }),
        defineField({
            name: 'text',
            title: 'Monthly Update Text',
            type: 'text',
            rows: 6,
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'thumbnail',
            title: 'Monthly Update Thumbnail',
            type: 'image',
            options: {
                hotspot: true
            },
        }),
    ],
    preview: {
        select: {
            title: 'Monthly Update',
            media: 'thumbnail'
        }
    }
})
