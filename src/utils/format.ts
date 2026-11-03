const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
]

export function timeAgo(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size || unit === 'second') {
      if (unit === 'second' && Math.abs(seconds) < 10) return 'just now'
      return rtf.format(Math.round(seconds / size), unit)
    }
  }
  return ''
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#E8C547',
  TypeScript: '#3178C6',
  Python: '#3657D6',
  'Jupyter Notebook': '#F28B54',
  HTML: '#E06C4B',
  CSS: '#B6A6D9',
  'C++': '#6E5BA8',
  Dockerfile: '#5B7A99',
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Internal links start with "/" or "#"; everything else opens in a new tab. */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href)
}
