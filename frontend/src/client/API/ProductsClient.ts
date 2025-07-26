import { type ProductIn, type ProductOut } from "../generated/products/client";
import { get, post, put, del } from '@aws-amplify/api-rest';
import type { CreateParam, UpdateParam, DeleteParam } from "@/types";

const API_NAME = 'GestorAPI';
const API_PATH = '/products/api/v1';

// GET /products
export async function getProducts(): Promise<ProductOut[]> {
  const { response } = await get({ apiName: API_NAME, path: API_PATH });
  return ((await response).body.json()) as unknown as ProductOut[];
}


// POST /products
export async function createProduct({newEntity}:CreateParam<ProductIn>): Promise<ProductOut> {
  const { response } = await post({
    apiName: API_NAME,
    path: API_PATH,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(JSON.stringify(newEntity))
    }
  });
  return ((await response).body.json()) as unknown as ProductOut;
}

// PUT /products/{code}
export async function updateProduct({code, updatedEntity}: UpdateParam<'code',ProductIn>): Promise<ProductOut> {
  const { response } = await put({
    apiName: API_NAME,
    path: `${API_PATH}/${code}`,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(JSON.stringify(updatedEntity))
    }
  });
  return ((await response).body.json()) as unknown as ProductOut;
}

// DELETE /products/{code}
export async function deleteProduct({code}: DeleteParam<'code'>): Promise<void> {
  await del({ apiName: API_NAME, path: `${API_PATH}/${code}` });
}
