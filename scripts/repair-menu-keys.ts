import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-18'})

async function repairDocument(type: 'footerSettings' | 'navigation') {
  const document = await client.fetch<{_id: string; items?: unknown[]; quickLinks?: unknown[]} | null>(
    `*[_type == $type][0]{_id, items, quickLinks}`,
    {type},
  )

  if (!document) {
    console.log(`No ${type} document found`)
    return
  }

  const field = type === 'navigation' ? 'items' : 'quickLinks'
  const items = (document[field] || []) as Array<Record<string, unknown>>
  const keyedItems = items.map((item, index) => ({
    ...item,
    _key: typeof item._key === 'string' && item._key ? item._key : `${type}-${index + 1}`,
  }))

  await client.patch(document._id).set({[field]: keyedItems}).commit()
  console.log(`Repaired ${keyedItems.length} ${field} item(s) in ${document._id}`)
}

await repairDocument('footerSettings')
await repairDocument('navigation')
