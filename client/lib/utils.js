import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from './constants'

/**
 * Merge class names — lightweight cn() without a dependency.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format a number as currency.
 * Defaults to INR for the Indian market.
 */
export function formatPrice(amount, currency = DEFAULT_CURRENCY) {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style:                'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format an ISO date string to a human-readable date.
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(DEFAULT_LOCALE, {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text, maxLength = 120) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}

/**
 * Slugify a string for URLs.
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Delay — useful for staggered animations.
 */
export const delay = (ms) => new Promise((res) => setTimeout(res, ms))

/**
 * Clamp a number between min and max.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
