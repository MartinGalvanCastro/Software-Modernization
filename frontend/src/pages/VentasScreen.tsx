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
import { getSales, createSales, updateSales, deleteSales } from '@/client/API/SalesClient';
import { getProducts } from '@/client/API/ProductsClient';
import { getSellers } from '@/client/API/SellersClient';
import { AddModal, EditModal } from '@/components/forms';
import { getSalesFormFields } from '@/components/forms/entityFieldsConfig';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import type { SaleOut, SaleIn } from '@/client/generated/sales/client';
import type { ProductOut } from '@/client/generated/products/client';
import type { SellerOut } from '@/client/generated/sellers/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export const VentasScreen: React.FC = () => {
  // Set dynamic page title
  useDocumentTitle('Ventas');

  // Modal state management
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<SaleOut | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // API hooks for sales
  const {
    data: sales,
    isLoading,
    error,
  } = useGetEntities({
    queryKey: 'sales',
    getFn: getSales,
  });

  // API hooks for products and sellers (for dropdown options)
  const { data: products = [] } = useGetEntities({
    queryKey: 'products',
    getFn: getProducts,
  });

  const { data: sellers = [] } = useGetEntities({
    queryKey: 'sellers',
    getFn: getSellers,
  });

  // Mutation hooks
  const createMutation = useCreateEntity({
    queryKey: 'sales',
    createFn: createSales,
  });

  const updateMutation = useUpdateEntity({
    queryKey: 'sales',
    updateFn: updateSales,
  });

  const deleteMutation = useDeleteEntity({
    queryKey: 'sales',
    deleteFn: deleteSales,
  });

  // Helper functions to get names from codes
  const getSellerName = (sellerCode: string) => {
    const seller = sellers.find(s => s.id === sellerCode);
    return seller ? seller.name : sellerCode;
  };

  const getProductName = (productCode: string) => {
    const product = products.find(p => p.code === productCode);
    return product ? product.name : productCode;
  };

  // Event handlers
  const handleAdd = () => {
    setModalMode('create');
    setCurrentSale(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (sale: SaleOut) => {
    setModalMode('edit');
    setCurrentSale(sale);
    setIsFormModalOpen(true);
  };

  const handleDelete = (sale: SaleOut) => {
    setCurrentSale(sale);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    const saleData: SaleIn = {
      invoiceNumber: formData.invoiceNumber as string,
      saleDate: new Date(formData.saleDate as string),
      sellerCode: formData.sellerCode as string,
      productCode: formData.productCode as string,
    };

    if (modalMode === 'create') {
      await createMutation.mutateAsync({ newEntity: saleData });
    } else if (currentSale) {
      await updateMutation.mutateAsync({ 
        id: currentSale.id, 
        updatedEntity: saleData 
      });
    }
    
    // Don't close modal here - let GenericModal handle success feedback and auto-close
    // setIsFormModalOpen(false);
    // setCurrentSale(null);
  };

  const handleDeleteConfirm = async () => {
    if (currentSale) {
      await deleteMutation.mutateAsync({ id: currentSale.id });
      setIsDeleteModalOpen(false);
      setCurrentSale(null);
    }
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentSale(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="ventas" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Cargando ventas...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="ventas" />
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
      <Navbar currentPage="ventas" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
            <p className="mt-2 text-gray-600">
              Gestiona las ventas registradas en el sistema
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Lista de Ventas</CardTitle>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Registrar Venta
              </Button>
            </CardHeader>
            <CardContent>
              {sales && sales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Número de Factura</TableHead>
                      <TableHead>Fecha de Venta</TableHead>
                      <TableHead>Vendedor</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Fecha de Creación</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.id}</TableCell>
                        <TableCell>{sale.invoiceNumber}</TableCell>
                        <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                        <TableCell>{getSellerName(sale.sellerCode)}</TableCell>
                        <TableCell>{getProductName(sale.productCode)}</TableCell>
                        <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(sale)}
                              className="flex items-center gap-1"
                            >
                              <Pencil className="h-3 w-3" />
                              Editar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(sale)}
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
                  <p className="text-gray-500">No hay ventas registradas</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Modal */}
      {isFormModalOpen && modalMode === 'create' && (
        <AddModal
          entityType="sale"
          isOpen={isFormModalOpen}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          isSubmitting={createMutation.isPending}
          customFields={getSalesFormFields(sellers, products)}
        />
      )}

      {/* Edit Modal */}
      {isFormModalOpen && modalMode === 'edit' && currentSale && (
        <EditModal
          entityType="sale"
          isOpen={isFormModalOpen}
          entityData={currentSale}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
          isSubmitting={updateMutation.isPending}
          customFields={getSalesFormFields(sellers, products)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentSale && (
        <ConfirmDeleteModal
          title="Confirmar eliminación"
          message={`¿Estás seguro de que quieres eliminar la venta "${currentSale.invoiceNumber}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteConfirm}
          onClose={handleCloseModal}
          isSubmitting={deleteMutation.isPending}
          successMessage={`Venta "${currentSale.invoiceNumber}" eliminada exitosamente.`}
        />
      )}
    </div>
  );
};

export default VentasScreen;
