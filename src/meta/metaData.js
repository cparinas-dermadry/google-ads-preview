// Meta's recommended lengths. Longer text is allowed but gets cut off in most placements.
export const META_LIMITS = {
  username: 30,
  primaryText: 125,
  headline: 27,
  description: 27,
}

export const MAX_CARDS = 10
export const MIN_CARDS = 2

export const META_CTAS = [
  'Learn more',
  'Shop now',
  'Sign up',
  'Book now',
  'Order now',
  'Get offer',
  'Contact us',
  'Send message',
  'Subscribe',
  'Download',
  'Apply now',
  'Watch more',
]

export const emptyCard = () => ({ media: null, headline: '', description: '' })

export const META_EMPTY = {
  pageName: '',
  username: '',
  avatar: null,
  websiteUrl: '',
  primaryText: '',
  cta: 'Learn more',
  format: 'single',

  media: null,
  verticalMedia: null,
  headline: '',
  description: '',

  cards: [emptyCard(), emptyCard(), emptyCard()],
}

export const META_SAMPLE = {
  pageName: 'Dermadry',
  username: 'dermadry',
  avatar: null,
  websiteUrl: 'https://www.dermadry.com',
  primaryText:
    'Tired of sweaty hands? Dermadry treats excessive sweating at home with tap water. No needles, no surgery, just dry hands.',
  cta: 'Shop now',
  format: 'single',

  media: null,
  verticalMedia: null,
  headline: 'Dry Hands in Weeks',
  description: 'FDA-cleared device',

  cards: [
    { media: null, headline: 'Dry Hands', description: 'Treat sweaty palms' },
    { media: null, headline: 'Dry Feet', description: 'Treat sweaty soles' },
    { media: null, headline: 'Dry Underarms', description: 'Treat sweaty armpits' },
  ],
}
