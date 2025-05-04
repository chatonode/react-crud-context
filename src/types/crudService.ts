/*
 * src/types/crudService.ts
 * Generic Crud Service combining all CRUD ops
 */
import {
  ReadAll,
  ReadOne,
  CreateOne,
  UpdateOne,
  DeleteOne,
} from './crudServiceOps'

export type CrudService<T, ID, CreatePayload, UpdatePayload> = ReadAll<T> &
  ReadOne<ID, T> &
  CreateOne<CreatePayload, T> &
  UpdateOne<ID, UpdatePayload, T> &
  DeleteOne<ID>
