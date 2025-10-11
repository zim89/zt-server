/**
 * API tags for Swagger documentation
 * Used in @ApiTags() decorator in controllers
 */
export const apiTags = {
  auth: 'auth',
  projects: 'projects',
  tasks: 'tasks',
  categories: 'categories',
  contacts: 'contacts',
  markers: 'markers',
} as const;

export type ApiTag = (typeof apiTags)[keyof typeof apiTags];

/**
 * API tags metadata for Swagger configuration
 * Used in main.ts for Swagger setup
 */
export const apiTagsMetadata = [
  {
    name: apiTags.auth,
    description: 'Authentication and authorization endpoints',
  },
  {
    name: apiTags.projects,
    description: 'Project management and membership operations',
  },
  {
    name: apiTags.tasks,
    description: 'Task management within projects',
  },
  {
    name: apiTags.categories,
    description: 'Task categories management',
  },
  {
    name: apiTags.contacts,
    description: 'Contacts and team members management',
  },
  {
    name: apiTags.markers,
    description: 'Task markers (labels/tags) management',
  },
] as const;
