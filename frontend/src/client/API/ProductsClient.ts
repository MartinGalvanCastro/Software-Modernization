import { type ProductIn, type ProductOut } from "../generated/products/client";
import { get, post, put, del } from '@aws-amplify/api-rest';
import type { DeleteParam } from "@/types";

// Payload type for create/update product with image
export interface ProductWithImage {
  product: ProductIn;
  image: File | Blob;
}

export interface CreateProductParam {
  newEntity: ProductWithImage;
}

export interface UpdateProductParam {
  code: string;
  updatedEntity: ProductWithImage;
}

const API_NAME = 'GestorAPI';
const API_PATH = '/products/api/v1';

// GET /products
export async function getProducts(): Promise<ProductOut[]> {
  const { response } = await get({ apiName: API_NAME, path: API_PATH });
  return ((await response).body.json()) as unknown as ProductOut[];
}


// POST /products
export async function createProduct({ newEntity }: CreateProductParam): Promise<ProductOut> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(newEntity.product));
  formData.append('image', newEntity.image);
  const { response } = await post({
    apiName: API_NAME,
    path: API_PATH,
    options: {
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    }
  });
  return ((await response).body.json()) as unknown as ProductOut;
}

// PUT /products/{code}
export async function updateProduct({ code, updatedEntity }: UpdateProductParam): Promise<ProductOut> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(updatedEntity.product));
  formData.append('image', updatedEntity.image);
  const { response } = await put({
    apiName: API_NAME,
    path: `${API_PATH}/${code}`,
    options: {
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    }
  });
  return ((await response).body.json()) as unknown as ProductOut;
}

// DELETE /products/{code}
export async function deleteProduct({code}: DeleteParam<'code'>): Promise<void> {
  await del({ apiName: API_NAME, path: `${API_PATH}/${code}` });
}
