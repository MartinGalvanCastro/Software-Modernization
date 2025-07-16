import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useGetEntities } from '@/hooks/api/useGetEntities';
import { getProducts } from '@/client/API/ProductsClient';
import type { ProductOut } from '@/client/generated/products/client';

export const ProductosScreen: React.FC = () => {
  // API hooks for products
  const {
    data: products,
    isLoading,
    error,
  } = useGetEntities({
    queryKey: 'products',
    getFn: getProducts,
  });

  const handleAdd = () => {
    // TODO: Implement add logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (_product: ProductOut) => {
    // TODO: Implement edit logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (_product: ProductOut) => {
    // TODO: Implement delete logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="productos" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Cargando productos...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="productos" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">Error: {error.message}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
      {/* Navbar */}
      <Navbar currentPage="productos" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="mt-2 text-gray-600">
              Gestiona el catálogo de productos de la tienda
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Lista de Productos</CardTitle>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Producto
              </Button>
            </CardHeader>
            <CardContent>
              {products && products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.code}>
                        <TableCell className="font-medium">{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="flex items-center gap-1"
                            >
                              <Pencil className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay productos registrados</p>
                  <Button onClick={handleAdd} className="mt-4">
                    Agregar primer producto
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProductosScreen;
