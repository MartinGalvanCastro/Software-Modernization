import React, { useState } from 'react';
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
import { useCreateEntity } from '@/hooks/api/useCreateEntity';
import { useUpdateEntity } from '@/hooks/api/useUpdateEntity';
import { useDeleteEntity } from '@/hooks/api/useDeleteEntity';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/client/API/ProductsClient';
import { AddModal, EditModal } from '@/components/forms';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import type { ProductOut, ProductIn } from '@/client/generated/products/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const ProductosScreen: React.FC = () => {
  // Set dynamic page title
  useDocumentTitle('Productos');

  // Modal state management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductOut | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // API hooks for products
  const {
    data: products,
    isLoading,
    error,
  } = useGetEntities({
    queryKey: 'products',
    getFn: getProducts,
  });

  // Mutation hooks
  const createMutation = useCreateEntity({
    queryKey: 'products',
    createFn: createProduct,
  });

  const updateMutation = useUpdateEntity({
    queryKey: 'products',
    updateFn: updateProduct,
  });

  const deleteMutation = useDeleteEntity({
    queryKey: 'products',
    deleteFn: deleteProduct,
  });

  // Event handlers
  const handleAdd = () => {
    setModalMode('create');
    setCurrentProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product: ProductOut) => {
    setModalMode('edit');
    setCurrentProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDelete = (product: ProductOut) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    const productData: ProductIn = {
      name: formData.name as string,
      description: formData.description as string,
      price: Number(formData.price), // Price is a number, not Price type
    };

    if (modalMode === 'create') {
      await createMutation.mutateAsync({ newEntity: productData });
    } else if (currentProduct) {
      await updateMutation.mutateAsync({ 
        code: currentProduct.code, 
        updatedEntity: productData 
      });
    }
    
    // Don't close modal here - let GenericModal handle success feedback and auto-close
    // setIsFormModalOpen(false);
    // setCurrentProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (currentProduct) {
      await deleteMutation.mutateAsync({ code: currentProduct.code });
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentProduct(null);
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Modal */}
      {isFormModalOpen && modalMode === 'create' && (
        <AddModal
          entityType="product"
          isOpen={isFormModalOpen}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          isSubmitting={createMutation.isPending}
        />
      )}

      {/* Edit Modal */}
      {isFormModalOpen && modalMode === 'edit' && currentProduct && (
        <EditModal
          entityType="product"
          isOpen={isFormModalOpen}
          entityData={currentProduct}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          isSubmitting={updateMutation.isPending}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <ConfirmDeleteModal
          title="Confirmar eliminación"
          message={`¿Estás seguro de que quieres eliminar el producto "${currentProduct.name}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          isSubmitting={deleteMutation.isPending}
          successMessage={`Producto "${currentProduct.name}" eliminado exitosamente.`}
        />
      )}
    </div>
  );
};

export default ProductosScreen;
