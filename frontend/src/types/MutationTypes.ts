/** 
 * For update operations: pass the primary key under the name PK, plus the updated entity payload. 
 */
export type UpdateParam<PK extends string, T> = {
  [K in PK]: string;
} & {
  updatedEntity: T;
};

/** 
 * For delete operations: pass only the primary key under the name PK. 
 */
export type DeleteParam<PK extends string> = {
  [K in PK]: string;
};


/**
 * For create operations: pass the new entity payload under the key `newEntity`.
 */
export type CreateParam<T> = {
  newEntity: T;
};
