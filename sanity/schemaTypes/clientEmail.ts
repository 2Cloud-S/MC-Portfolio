import { Rule } from '@sanity/types'

export default {
  name: 'clientEmail',
  title: 'Client Email',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule: Rule) => rule.required().email(),
    },
  ],
}