import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { EntityFormModal } from './EntityFormModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface GenericTableProps<T> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  onAdd?: (item: Omit<T, 'id'>) => Promise<void>;
  onEdit?: (id: string | number, item: Partial<T>) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  addFormFields?: FormField[];
  editFormFields?: FormField[];
  getItemId: (item: T) => string | number;
  getItemName?: (item: T) => string; // For delete confirmation
  loading?: boolean;
  addButtonText?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export function GenericTable<T extends { id: string | number }>({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  addFormFields = [],
  editFormFields = [],
  getItemId,
  getItemName,
  loading = false,
  addButtonText = 'Agregar'
}: GenericTableProps<T>) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (formData: Record<string, unknown>) => {
    if (!onAdd) return;
    
    setIsSubmitting(true);
    try {
      await onAdd(formData as Omit<T, 'id'>);
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (formData: Record<string, unknown>) => {
    if (!onEdit || !selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await onEdit(getItemId(selectedItem), formData as Partial<T>);
      setShowEditModal(false);
      setSelectedItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await onDelete(getItemId(selectedItem));
      setShowDeleteModal(false);
      setSelectedItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (item: T) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item: T) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const renderCellValue = (column: TableColumn<T>, item: T) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    return value?.toString() || '-';
  };

  const getInitialFormData = (item?: T) => {
    if (!item) return {};
    
    const fields = showEditModal ? editFormFields : addFormFields;
    const initialData: Record<string, unknown> = {};
    
    fields.forEach(field => {
      initialData[field.name] = item[field.name as keyof T] || '';
    });
    
    return initialData;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {onAdd && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {addButtonText}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={String(column.key)}>{column.label}</TableHead>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableHead className="text-right">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                      className="text-center py-8"
                    >
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                      className="text-center py-8 text-gray-500"
                    >
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={getItemId(item) || index}>
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {renderCellValue(column, item)}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {onEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteModal(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Modal */}
      <EntityFormModal
        isOpen={showAddModal}
        mode="create"
        title={title.slice(0, -1)} // Remove 's' from title
        fields={addFormFields}
        initialData={{}}
        onSubmit={handleAdd}
        onClose={() => setShowAddModal(false)}
        isSubmitting={isSubmitting}
      />

      {/* Edit Modal */}
      <EntityFormModal
        isOpen={showEditModal}
        mode="edit"
        title={title.slice(0, -1)} // Remove 's' from title
        fields={editFormFields}
        initialData={selectedItem ? getInitialFormData(selectedItem) : {}}
        onSubmit={handleEdit}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <ConfirmDeleteModal
          title="Confirmar eliminación"
          message={`¿Estás seguro de que quieres eliminar ${
            getItemName ? getItemName(selectedItem) : 'este elemento'
          }? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}
