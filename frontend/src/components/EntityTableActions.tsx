import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface EntityTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  editVariant?: 'outline' | 'default';
  deleteVariant?: 'destructive' | 'outline';
  size?: 'sm' | 'lg' | 'default' | 'icon';
}

export const EntityTableActions: React.FC<EntityTableActionsProps> = ({
  onEdit,
  onDelete,
  editLabel = 'Editar',
  deleteLabel = 'Eliminar',
  editVariant = 'outline',
  deleteVariant = 'destructive',
  size = 'sm',
}) => (
  <div className="flex items-center gap-2 justify-end">
    <Button
      variant={editVariant}
      size={size}
      onClick={onEdit}
      className="flex items-center gap-1"
    >
      <Pencil className="h-3 w-3" />
      {editLabel}
    </Button>
    <Button
      variant={deleteVariant}
      size={size}
      onClick={onDelete}
      className="flex items-center gap-1"
    >
      <Trash2 className="h-3 w-3" />
      {deleteLabel}
    </Button>
  </div>
);
