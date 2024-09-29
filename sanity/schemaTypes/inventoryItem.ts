import { Rule } from '@sanity/types'

export default {
  name: 'inventoryItem',
  title: 'Inventory Item',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'level',
      title: 'Level',
      type: 'number',
      validation: (rule: Rule) => rule.min(1).max(10).integer(),
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
    },
  ],
}