import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'campaign',
  title: 'Campaign',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Campaign ID',
      type: 'string',
      description: 'Unique identifier for the campaign (used in URL)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'impactDescription',
      title: 'Impact Description',
      type: 'text',
      description: 'Detailed description of what one unit of impact provides',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'impactItem',
      title: 'Impact Item',
      type: 'string',
      description: 'Name of the item/unit being provided (e.g., "Quranbit Lesson", "Pantry Item")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'impactPrompt',
      title: 'Impact Prompt',
      type: 'object',
      description: 'Different tenses of the action verb for impact',
      fields: [
        defineField({
          name: 'present',
          title: 'Present Tense',
          type: 'string',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'continuous',
          title: 'Continuous Tense',
          type: 'string',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'past',
          title: 'Past Tense',
          type: 'string',
          validation: Rule => Rule.required()
        })
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'unitPrice',
      title: 'Unit Price',
      type: 'number',
      description: 'Price per unit in SGD',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'iconPath',
      title: 'Icon',
      type: 'image',
      description: 'Campaign icon/image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'url',
      title: 'Campaign URL',
      type: 'url',
      description: 'External URL for the campaign',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'unitImpact',
      title: 'Unit Impact',
      type: 'number',
      description: 'Impact value per unit (typically 1)',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'isFullySponsored',
      title: 'Is Fully Sponsored',
      type: 'boolean',
      description: 'Whether the campaign is fully sponsored',
      initialValue: false
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured',
      type: 'boolean',
      description: 'Whether the campaign should be featured',
      initialValue: false
    }),
    defineField({
      name: 'oneTimeUrl',
      title: 'One Time URL',
      type: 'url',
      description: 'Optional one-time donation URL'
    }),
    defineField({
      name: 'organisation',
      title: 'Organisation',
      type: 'reference',
      to: [{type: 'organisation'}],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'impactPromptAlt',
      title: 'Impact Prompt Alternative',
      type: 'string',
      description: 'Alternative impact prompt text (e.g., "📖 Enabled", "🛒 Contributed")'
    }),
    defineField({
      name: 'impactOptions',
      title: 'Impact Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'units',
              title: 'Units',
              type: 'number',
              validation: Rule => Rule.required().min(1)
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              description: 'Optional description for the impact option'
            }),
            defineField({
              name: 'isDefault',
              title: 'Is Default',
              type: 'boolean',
              description: 'Whether this is the default option',
              initialValue: false
            })
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'units'
            },
            prepare({title, subtitle}) {
              return {
                title,
                subtitle: `${subtitle} units`
              }
            }
          }
        }
      ],
      validation: Rule => Rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'iconPath'
    }
  }
})