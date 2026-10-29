export const LIMITS = {
  businessName: 25,
  path: 15,
  headline: 30,
  description: 90,
  sitelinkText: 25,
  sitelinkLine: 35,
  shortHeadline: 30,
  longHeadline: 90,
  displayDescription: 90,
  dgHeadline: 40,
  dgDescription: 90,
}

export const MAX = {
  headlines: 15,
  descriptions: 4,
  sitelinks: 4,
}

export const CTAS = [
  'Shop now',
  'Learn more',
  'Buy now',
  'Get offer',
  'Sign up',
  'Contact us',
  'Book now',
  'Get quote',
  'Subscribe',
  'Download',
]

export const DEFAULT_AD = {
  businessName: 'Dermadry',
  finalUrl: 'https://www.dermadry.com',
  path1: 'hyperhidrosis',
  path2: 'treatment',
  logo: null,
  cta: 'Shop now',

  headlines: [
    'Stop Excessive Sweating',
    'FDA-Cleared Device',
    'Treat Sweaty Hands at Home',
    'Free Shipping Available',
    '',
  ],
  descriptions: [
    'Treat hyperhidrosis at home with tap water iontophoresis. No needles, no surgery.',
    'Dry hands, feet and underarms in weeks. Try it risk free with our money back guarantee.',
  ],
  sitelinks: [
    { text: 'How It Works', line1: 'Tap water iontophoresis', line2: 'Results in a few weeks' },
    { text: 'Shop Devices', line1: 'Hands, feet and underarms', line2: 'Free shipping' },
    { text: 'Reviews', line1: 'Thousands of happy customers', line2: '' },
    { text: 'Insurance', line1: 'Check your coverage', line2: '' },
  ],

  landscapeImage: null,
  squareImage: null,
  shortHeadline: 'Stop Excessive Sweating',
  longHeadline: 'Treat hyperhidrosis at home with an FDA-cleared iontophoresis device',
  displayDescription: 'No needles, no surgery. Dry hands and feet in weeks.',

  dgMedia: null,
  dgHeadline: 'Finally, dry hands without needles',
  dgDescription: 'Treat sweaty hands, feet and underarms at home with Dermadry.',
}

export const EMPTY_AD = {
  businessName: '',
  finalUrl: '',
  path1: '',
  path2: '',
  logo: null,
  cta: 'Shop now',

  headlines: ['', '', ''],
  descriptions: ['', ''],
  sitelinks: [],

  landscapeImage: null,
  squareImage: null,
  shortHeadline: '',
  longHeadline: '',
  displayDescription: '',

  dgMedia: null,
  dgHeadline: '',
  dgDescription: '',
}

export function displayDomain(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname
  } catch {
    return url || 'www.example.com'
  }
}
