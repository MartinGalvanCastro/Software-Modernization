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
import { getSellers } from '@/client/API/SellersClient';
import type { SellerOut } from '@/client/generated/sellers/client';

export const VendedoresScreen: React.FC = () => {
  // API hooks for sellers
  const {
    data: sellers,
    isLoading,
    error,
  } = useGetEntities({
    queryKey: 'sellers',
    getFn: getSellers,
  });

  const handleAdd = () => {
    // TODO: Implement add logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (_seller: SellerOut) => {
    // TODO: Implement edit logic
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (_seller: SellerOut) => {
    // TODO: Implement delete logic
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="vendedores" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-gray-600">Cargando vendedores...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 shadow-2xl rounded-lg m-4 p-4">
        <Navbar currentPage="vendedores" />
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
      {/* Navbar with rounded corners */}
      <Navbar currentPage="vendedores" />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Vendedores</h1>
            <p className="mt-2 text-gray-600">
              Gestiona el equipo de vendedores de la empresa
            </p>
          </div>

          {/* Add Button */}
          <div className="mb-6">
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agregar Vendedor
            </Button>
          </div>

          {/* Sellers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Vendedores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers && sellers.length > 0 ? (
                    sellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.id}</TableCell>
                        <TableCell>{seller.name}</TableCell>
                        <TableCell>{seller.email}</TableCell>
                        <TableCell>{new Date(seller.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(seller)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(seller)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No hay vendedores registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default VendedoresScreen;
