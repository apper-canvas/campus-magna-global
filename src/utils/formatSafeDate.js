import { format, isValid, parseISO } from 'date-fns'

/**
 * Safely formats a date value, handling invalid dates gracefully
 * @param {string|Date|number} dateValue - The date value to format
 * @param {string} formatString - The format string to use (default: "MMM d, yyyy")
 * @param {string} fallback - Fallback text for invalid dates (default: "Invalid date")
 * @returns {string} Formatted date string or fallback text
 */
export const formatSafeDate = (dateValue, formatString = "MMM d, yyyy", fallback = "Invalid date") => {
  // Handle null, undefined, or empty string
  if (!dateValue || dateValue === '' || dateValue === 'null' || dateValue === 'undefined') {
    return fallback
  }

  let date
  
  try {
    // If it's already a Date object
    if (dateValue instanceof Date) {
      date = dateValue
    }
    // If it's a number (timestamp)
    else if (typeof dateValue === 'number') {
      date = new Date(dateValue)
    }
    // If it's a string, try to parse it
    else if (typeof dateValue === 'string') {
      // Try ISO format first
      if (dateValue.includes('T') || dateValue.includes('-')) {
        date = parseISO(dateValue)
      } else {
        date = new Date(dateValue)
      }
    }
    // Fallback to new Date() constructor
    else {
      date = new Date(dateValue)
    }

    // Check if the resulting date is valid
    if (isValid(date)) {
      return format(date, formatString)
    } else {
      return fallback
    }
  } catch (error) {
    console.warn('Date formatting error:', error.message, 'for value:', dateValue)
    return fallback
  }
}

export default formatSafeDate