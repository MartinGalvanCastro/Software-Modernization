import { type SaleIn, type SaleOut } from "../generated/sales/client";
import { get, post, put, del } from '@aws-amplify/api-rest';
import type { CreateParam, UpdateParam, DeleteParam } from "@/types";

const API_NAME = 'GestorAPI';
const API_PATH = '/sales/api/v1';

// GET /Sales
export async function getSales(): Promise<SaleOut[]> {
  const { response } = await get({ apiName: API_NAME, path: API_PATH });
  return ((await response).body.json()) as unknown as SaleOut[];
}


// POST /Sales
export async function createSales({newEntity}:CreateParam<SaleIn>): Promise<SaleOut> {
  const { response } = await post({
    apiName: API_NAME,
    path: API_PATH,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(JSON.stringify(newEntity))
    }
  });
  return ((await response).body.json()) as unknown as SaleOut;
}

// PUT /Sales/{id}
export async function updateSales({id, updatedEntity}: UpdateParam<'id',SaleIn>): Promise<SaleOut> {
  const { response } = await put({
    apiName: API_NAME,
    path: `${API_PATH}/${id}`,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.parse(JSON.stringify(updatedEntity))
    }
  });
  return ((await response).body.json()) as unknown as SaleOut;
}

// DELETE /Sales/{id}
export async function deleteSales({id}: DeleteParam<'id'>): Promise<void> {
  await del({ apiName: API_NAME, path: `${API_PATH}/${id}` });
}
