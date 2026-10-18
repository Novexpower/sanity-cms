import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ImageIcon} from '@sanity/icons/Image'
import {LinkIcon} from '@sanity/icons/Link'
import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
  })

const menuItem = defineType({
  name: 'menuItem',
  title: 'Menu item',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({name: 'text', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'url', type: 'string', validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'text', subtitle: 'url'},
  },
})

const metadata = defineType({
  name: 'siteMetadata',
  title: 'Site metadata',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', type: 'text', rows: 3}),
  ],
})

const socials = defineType({
  name: 'socialLinks',
  title: 'Social links',
  type: 'object',
  fields: [
    defineField({name: 'linkedin', type: 'url'}),
  ],
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'siteName', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'siteUrl', type: 'url'}),
    defineField({name: 'metadata', type: 'siteMetadata'}),
    defineField({name: 'language', type: 'string'}),
    defineField({name: 'locale', type: 'string'}),
    imageField('siteLogo', 'Site logo'),
    defineField({name: 'googleAnalyticsId', type: 'string'}),
  ],
})

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({name: 'heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'subheading', type: 'text', rows: 3}),
    imageField('centerImage', 'Center image'),
  ],
})

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'email', type: 'email'}),
    defineField({name: 'role', type: 'string'}),
    defineField({name: 'message', type: 'text', rows: 5}),
    imageField('avatar', 'Avatar'),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'avatar'},
  },
})

export const collaborator = defineType({
  name: 'collaborator',
  title: 'Collaborator',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'url', type: 'url'}),
    imageField('logo', 'Logo'),
  ],
  preview: {
    select: {title: 'name', subtitle: 'url', media: 'logo'},
  },
})

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  fields: [
    defineField({name: 'question', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'answer', type: 'text', rows: 8, validation: (rule) => rule.required()}),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer settings',
  type: 'document',
  fields: [
    defineField({name: 'subheading', type: 'text', rows: 3}),
    defineField({
      name: 'quickLinks',
      title: 'Quick links',
      type: 'array',
      of: [defineArrayMember({type: 'menuItem'})],
      options: {layout: 'list'},
      description: 'Links displayed in the footer.',
    }),
    defineField({name: 'email', type: 'email'}),
    defineField({name: 'telephone', type: 'string'}),
    defineField({name: 'socials', type: 'socialLinks'}),
  ],
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Menu items',
      type: 'array',
      of: [defineArrayMember({type: 'menuItem'})],
      options: {layout: 'list'},
      description: 'The links shown in the site navigation, in display order.',
    }),
  ],
})

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({name: 'subheading', type: 'text', rows: 3}),
    defineField({name: 'appStoreUrl', type: 'url'}),
    defineField({name: 'googlePlayUrl', type: 'url'}),
  ],
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'description', type: 'text', rows: 4}),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({name: 'date', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'location', type: 'string'}),
    imageField('image', 'Image'),
  ],
  preview: {
    select: {title: 'title', subtitle: 'date', media: 'image'},
  },
})

export const schemaTypes = [
  siteSettings,
  hero,
  teamMember,
  collaborator,
  faq,
  footerSettings,
  navigation,
  cta,
  event,
  menuItem,
  metadata,
  socials,
]