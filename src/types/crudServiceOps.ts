/*
 * src/types/crudServiceOps.ts
 * Define granular CRUD operation interfaces
 */
export interface ReadAll<T> {
  GET_ALL(): Promise<T[]>
}

export interface ReadOne<ID, T> {
  GET(id: ID): Promise<T | undefined>
}

export interface CreateOne<P, T> {
  POST(payload: P): Promise<T>
}

export interface UpdateOne<ID, P, T> {
  PUT(id: ID, payload: P): Promise<T | undefined>
}

export interface DeleteOne<ID> {
  DELETE(id: ID): Promise<void>
}
