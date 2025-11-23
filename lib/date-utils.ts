/**
 * Format date consistently for server and client to avoid hydration mismatches
 */
export function formatDate(date: Date | string): string {
    const dateObj = date instanceof Date ? date : new Date(date)

    // Use a consistent format that works the same on server and client
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')

    return `${day}/${month}/${year}`
}
