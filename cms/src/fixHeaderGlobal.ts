import type { MongooseAdapter } from '@payloadcms/db-mongodb'
import type { Payload } from 'payload'

import { sanitizeTextFieldValue } from './globals/sanitizeGlobalFieldValues'

export async function fixHeaderGlobal(payload: Payload) {
  const db = payload.db as MongooseAdapter
  const rawHeader = await db.globals.findOne({ globalType: 'header' }).lean() as Record<string, unknown> | null

  if (!rawHeader) {
    return
  }

  const updates: Record<string, string | null> = {}

  if (typeof rawHeader.phone === 'object' && rawHeader.phone !== null) {
    updates.phone = sanitizeTextFieldValue(rawHeader.phone) ?? null
  }

  if (typeof rawHeader.clientLoginLink === 'object' && rawHeader.clientLoginLink !== null) {
    updates.clientLoginLink = sanitizeTextFieldValue(rawHeader.clientLoginLink) ?? null
  }

  if (Object.keys(updates).length === 0) {
    return
  }

  payload.logger.info('Migrating header global: fixing corrupted text field data')

  await db.globals.updateOne({ globalType: 'header' }, { $set: updates })
}
