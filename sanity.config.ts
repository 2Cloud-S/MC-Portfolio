'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/dashboard/[[...tool]]/page.tsx` route
 */

import {deskTool} from 'sanity/desk'
import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {schema} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'BluJayMC Portfolio',

  projectId: 'your-project-id',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schema.types,
  },
})
