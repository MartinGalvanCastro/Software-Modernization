import type { CreateParam, DeleteParam, UpdateParam } from "./MutationTypes";

/** A simple “GET‐style” service that returns T. */
export type GetService<T> = () => Promise<T>;

/** A “CREATE‐style” service that takes a CreateParam<U> and returns T. */
export type CreateService<U, T> = (param: CreateParam<U>) => Promise<T>;

/** An “UPDATE‐style” service that takes an UpdateParam<PK,U> and returns T. */
export type UpdateService<PK extends string, U, T> = (
  param: UpdateParam<PK, U>
) => Promise<T>;

/** A “DELETE‐style” service that takes a DeleteParam<PK> and returns void. */
export type DeleteService<PK extends string> = (
  param: DeleteParam<PK>
) => Promise<void>;