/**
 * Controller paths for @Controller() decorator
 * Prevents hardcoded strings and provides single source of truth
 */
export const controllerPaths = {
  auth: 'auth',
  projects: 'projects',
  tasks: 'tasks',
  categories: 'categories',
  contacts: 'contacts',
  markers: 'markers',
} as const;

export type ControllerPath =
  (typeof controllerPaths)[keyof typeof controllerPaths];

/**
 * API version prefix (for future versioning)
 * Example: 'v1', 'v2', etc.
 */
export const API_VERSION: string = ''; // Empty for now, can be 'v1' later

/**
 * Build full controller path with optional version
 */
export function buildControllerPath(path: string): string {
  return API_VERSION ? `${API_VERSION}/${path}` : path;
}
