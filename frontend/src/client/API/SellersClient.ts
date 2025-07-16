import { type SellerIn, type SellerOut } from "../generated/sellers/client";
import { get, post, put, del } from 'aws-amplify/api';
import type { CreateParam, UpdateParam, DeleteParam } from "@/types";

const API_NAME = 'GestorAPI';
const API_PATH = 'sellers/api/v1';

// GET /Sellers
export async function getSellers(): Promise<SellerOut[]> {
  const { response } = await get({ apiName: API_NAME, path: API_PATH });
  return ((await response).body.json()) as unknown as SellerOut[];
}


// POST /Sellers
export async function createSellers({newEntity}:CreateParam<SellerIn>): Promise<SellerOut> {
  const { response } = await post({
    apiName: API_NAME,
    path: API_PATH,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntity)
    }
  });
  return ((await response).body.json()) as unknown as SellerOut;
}

// PUT /Sellers/{id}
export async function updateSellers({id, updatedEntity}: UpdateParam<'id',SellerIn>): Promise<SellerOut> {
  const { response } = await put({
    apiName: API_NAME,
    path: `${API_PATH}/${id}`,
    options: {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntity)
    }
  });
  return ((await response).body.json()) as unknown as SellerOut;
}

// DELETE /Sellers/{id}
export async function deleteSellers({id}: DeleteParam<'id'>): Promise<void> {
  await del({ apiName: API_NAME, path: `${API_PATH}/${id}` });
}
