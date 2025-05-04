/**
 * Main export file for react-crud-context
 */

// Re-export the main context creator function
export { createCrudContext } from './createCrudContext';
export type { CrudService } from './service';

// Export any other utility types that might be needed by consumers
// export type {
//   // Extract these types from createCrudContext for external use
//   OpState,
//   StateMap,
//   Action,
// } from './createCrudContext';
