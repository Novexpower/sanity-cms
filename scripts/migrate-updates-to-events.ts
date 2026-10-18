import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-18'})

const descriptions: Record<string, string> = {
  'NovexPower Joins The Pioneer Program By KTH Ventures':
    'NovexPower joins the Pioneer Program by KTH Ventures, connecting with founders and innovators building the future.',
  'NovexPower at NORDEEP 5th Anniversary Edition':
    'NovexPower takes part in the NORDEEP 5th Anniversary Edition in Stockholm.',
  'NovexPower Is Awarded The VFT Funding From VINNOVA':
    'NovexPower is awarded VFT funding from VINNOVA to support the next stage of development.',
  'Batch 22 at KTH Innovation Launch':
    'NovexPower celebrates the Batch 22 launch at KTH Innovation.',
  'NovexPower Co-hosting Beers & Batts, The Swedish Battery Reboot':
    'NovexPower co-hosts Beers & Batts, The Swedish Battery Reboot.',
  'NovexPower as Speaker & Contributor at Beers & Batts':
    'NovexPower joins Beers & Batts as a speaker and contributor.',
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const body = (description: string) => [
  {
    _type: 'block',
    _key: 'intro',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: 'intro-span', text: description, marks: []}],
  },
]

const updates = await client.fetch<
  Array<{_id: string; name: string; date: string; location?: string; image?: {_ref: string}}>
>(`*[_type == "update"]{_id, name, date, location, "image": image.asset}`)

for (const update of updates) {
  const slug = slugify(update.name)
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "event" && slug.current == $slug][0]{_id}`,
    {slug},
  )

  if (!existing) {
    const description = descriptions[update.name] || update.name
    await client.create({
      _type: 'event',
      title: update.name,
      slug: {_type: 'slug', current: slug},
      description,
      body: body(description),
      date: update.date,
      location: update.location,
      image: update.image ? {_type: 'image', asset: update.image} : undefined,
    })
    console.log(`Created event: ${update.name}`)
  } else {
    console.log(`Skipped existing event: ${update.name}`)
  }

  await client.delete(update._id)
}
