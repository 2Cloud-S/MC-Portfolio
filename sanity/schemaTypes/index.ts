import { type SchemaTypeDefinition } from 'sanity'
import build from './build'
import about from './about'
import inventoryItem from './inventoryItem'
import clientEmail from './clientEmail'
import storeProduct from './storeProduct'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [build, about, inventoryItem, clientEmail, storeProduct],
}
