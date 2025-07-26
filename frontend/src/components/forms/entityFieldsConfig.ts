import type { FormField } from '@/components/GenericModal';

export type EntityType = 'product' | 'seller' | 'sale';

// Helper function to create options for dropdowns
export function createSelectOptions<T>(
  items: T[],
  valueField: keyof T,
  labelField: keyof T | ((item: T) => string)
): { value: string; label: string }[] {
  return items.map(item => ({
    value: String(item[valueField]),
    label: typeof labelField === 'function' 
      ? labelField(item)
      : String(item[labelField])
  }));
}

// Function to get sales form fields with dynamic options
export function getSalesFormFields(
  sellers: Array<{ id: string; name: string; email: string }> = [],
  products: Array<{ code: string; name: string; description: string; price: string }> = []
): FormField[] {
  return [
    {
      name: 'invoiceNumber',
      label: 'Número de Factura',
      type: 'text',
      required: true,
      placeholder: 'Número de factura'
    },
    {
      name: 'saleDate',
      label: 'Fecha de Venta',
      type: 'date',
      required: true,
      placeholder: 'YYYY-MM-DD'
    },
    {
      name: 'sellerCode',
      label: 'Vendedor',
      type: 'select',
      required: true,
      placeholder: 'Seleccionar vendedor',
      options: createSelectOptions(sellers, 'id', (seller) => `${seller.name} (${seller.email})`)
    },
    {
      name: 'productCode',
      label: 'Producto',
      type: 'select',
      required: true,
      placeholder: 'Seleccionar producto',
      options: createSelectOptions(products, 'code', (product) => `${product.name} - $${product.price}`)
    }
  ];
}

export const ENTITY_FIELDS_CONFIG: Record<EntityType, FormField[]> = {
  product: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre del producto'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      required: true,
      placeholder: 'Descripción del producto'
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'number',
      required: true,
      placeholder: '0.00',
      validation: { min: 0 }
    },
    {
      name: 'image',
      label: 'Imagen',
      type: 'file',
      required: true,
      placeholder: 'Selecciona una imagen',
      accept: 'image/*',
    }
  ],
  seller: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Nombre completo del vendedor'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'correo@ejemplo.com'
    }
  ],
  sale: [
    {
      name: 'invoiceNumber',
      label: 'Número de Factura',
      type: 'text',
      required: true,
      placeholder: 'Número de factura'
    },
    {
      name: 'saleDate',
      label: 'Fecha de Venta',
      type: 'date',
      required: true,
      placeholder: 'YYYY-MM-DD'
    },
    {
      name: 'sellerCode',
      label: 'Vendedor',
      type: 'select',
      required: true,
      placeholder: 'Seleccionar vendedor',
      options: [] // This will be populated dynamically
    },
    {
      name: 'productCode',
      label: 'Producto',
      type: 'select',
      required: true,
      placeholder: 'Seleccionar producto',
      options: [] // This will be populated dynamically
    }
  ]
};

export const ENTITY_LABELS: Record<EntityType, { singular: string; plural: string }> = {
  product: { singular: 'producto', plural: 'productos' },
  seller: { singular: 'vendedor', plural: 'vendedores' },
  sale: { singular: 'venta', plural: 'ventas' }
};
