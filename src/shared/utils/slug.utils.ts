/**
 * Generate URL-friendly slug from text
 *
 * @param text - Text to convert to slug
 * @returns URL-friendly slug
 *
 * @example
 * generateSlug('My Awesome Project!') // 'my-awesome-project'
 * generateSlug('Test  Project__2025') // 'test-project-2025'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores/multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
