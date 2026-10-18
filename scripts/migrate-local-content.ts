import {getCliClient} from 'sanity/cli'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const client = getCliClient({apiVersion: '2026-10-18'})
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../novexpower')
const assets = new Map<string, string>()

async function uploadImage(relativePath: string) {
  const existing = assets.get(relativePath)
  if (existing) return existing

  const filePath = path.join(appRoot, 'public', relativePath.replace(/^\//, ''))
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image not found: ${filePath}`)
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  assets.set(relativePath, asset._id)
  return asset._id
}

async function createIfMissing(
  type: string,
  document: Record<string, unknown>,
  match: string,
) {
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == $type && ${match}][0]{_id}`,
    {type, ...document},
  )

  if (existing) {
    console.log(`Skipped existing ${type}: ${existing._id}`)
    return
  }

  const created = await client.create({_type: type, ...document})
  console.log(`Created ${type}: ${created._id}`)
}

async function main() {
  await createIfMissing(
    'siteSettings',
    {
      siteName: 'NovexPower',
      siteUrl: 'https://novexpower.com',
      metadata: {
        title: 'Novexpower',
        description:
          'Novexpower empowers businesses with cutting-edge technology solutions to drive success and efficiency.',
      },
      language: 'en-us',
      locale: 'en-US',
      googleAnalyticsId: '',
    },
    'true',
  )

  await createIfMissing(
    'hero',
    {
      heading: 'Smarter Ground Power. Zero Emissions.',
      subheading:
        'Shaping the Future with Cutting-edge Battery Packs to Power Aircraft.',
      centerImage: {_type: 'image', asset: {_ref: await uploadImage('/images/hero-mockup.png')}},
    },
    'true',
  )

  const collaborators = [
    ['KTH Formula Student', 'https://kthformulastudent.se/', '/logos/kthfs.webp'],
    ['KTH', 'https://www.kth.se/om/innovation', '/logos/kth.webp'],
    ['Swedavia', 'https://www.swedavia.se/', '/images/SwedaviaPartners.png'],
  ]
  for (const [name, url, logo] of collaborators) {
    await createIfMissing(
      'collaborator',
      {name, url, logo: {_type: 'image', asset: {_ref: await uploadImage(logo)}}},
      'name == $name',
    )
  }

  const teamMembers = [
    ['Yaman Deif', 'yaman@novexpower.com', 'Mechatronics & Design', 'M.Sc. Mechatronic Engineering.\nExpert in battery hardware and software, system integration and manufacturing automation.', '/images/Yaman.png'],
    ['David Lloyd', 'david@novexpower.com', 'Battery Engineering & Chemistry', 'MSc Chemical Engineering. PhD Electrochemistry and energy storage. Worked at NorthVolt, more than two battery startups', '/images/David.jpeg'],
    ['Matt Davoudi', 'matt@novexpower.com', 'Business & Partnerships', 'MSc Transport Engineering. PhD in transportation science.(KTH). 7+ years in transport systems and innovation', '/images/Matt.jpg'],
  ]
  for (const [name, email, role, message, avatar] of teamMembers) {
    await createIfMissing(
      'teamMember',
      {name, email, role, message, avatar: {_type: 'image', asset: {_ref: await uploadImage(avatar)}}},
      'name == $name',
    )
  }

  const faqs = [
    ['What does NovexPower do exactly?', 'NovexPower develops advanced battery-powered electric ground power units (eGPUs) that replace diesel generators at airports. By combining innovative immersion-cooled battery technology with smart power solutions, we help airports reduce emissions, lower operating costs, and transition toward cleaner, more sustainable ground operations.'],
    ['Why NovexPower?', 'We focus on meeting our customers’ specific needs, by delivering battery packs tailored to their unique design requirements, not just generic off-the-shelf solutions.'],
    ['What makes the NovexPower eGPU unique?', 'Our eGPUs are powered by advanced immersion-cooled battery technology, designed to deliver reliable, high-performance ground power in all weather conditions.'],
    ['Is immersion cooling safe and effective?', 'Yes, immersion cooling is a well-established and reliable method for managing high-performance battery packs.'],
  ]
  for (const [question, answer] of faqs) {
    await createIfMissing('faq', {question, answer}, 'question == $question')
  }

  const updates = [
    ['NovexPower Joins The Pioneer Program By KTH Ventures', '8.11.26', 'Stockholm, Sweden', '/images/Pioneer.png'],
    ['NovexPower at NORDEEP 5th Anniversary Edition', '(16-17).10.26', 'Stockholm, Sweden', '/images/NordeepEvent5.png'],
    ['NovexPower Is Awarded The VFT Funding From VINNOVA', '15.10.26', 'Stockholm, Sweden', '/images/VFTFunding.png'],
    ['Batch 22 at KTH Innovation Launch', '15.01.26', 'Stockholm, Sweden', '/images/Team.webp'],
    ['NovexPower Co-hosting Beers & Batts, The Swedish Battery Reboot', '25.11.25', 'Stockholm, Sweden', '/images/battery-reboot-1.jpeg'],
    ['NovexPower as Speaker & Contributor at Beers & Batts', '25.11.25', 'Stockholm, Sweden', '/images/battery-reboot-2.jpeg'],
  ]
  for (const [name, date, location, image] of updates) {
    await createIfMissing(
      'update',
      {name, date, location, image: {_type: 'image', asset: {_ref: await uploadImage(image)}}},
      'name == $name',
    )
  }

  await createIfMissing(
    'footerSettings',
    {
      subheading: 'Empowering businesses with cutting-edge battery technology.',
      quickLinks: [{_key: 'quick-link-team', _type: 'menuItem', text: 'The Team', url: '#team'}],
      email: 'info@novexpower.com',
      telephone: '0046764143259',
      socials: {linkedin: 'https://www.linkedin.com/company/novexpower'},
    },
    'true',
  )

  await createIfMissing(
    'navigation',
    {
      items: [
        {_key: 'navigation-home', _type: 'menuItem', text: 'Home', url: '#home'},
        {_key: 'navigation-collaborators', _type: 'menuItem', text: 'Collaborators', url: '#collaborators'},
        {_key: 'navigation-team', _type: 'menuItem', text: 'The Team', url: '#team'},
        {_key: 'navigation-updates', _type: 'menuItem', text: 'Updates', url: '#events'},
      ],
    },
    'true',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
