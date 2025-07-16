import { GenericModal, type FormField } from './GenericModal';

interface EntityFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  title: string;
  fields: FormField[];
  initialData: Record<string, unknown>;
  onSubmit: (formData: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  entityName?: string; // e.g., "producto", "cliente"
}

export function EntityFormModal({
  isOpen,
  mode,
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  entityName
}: EntityFormModalProps) {
  if (!isOpen) return null;

  const modalTitle = mode === 'create' 
    ? `Agregar ${entityName || title}` 
    : `Editar ${entityName || title}`;
    
  const submitButtonText = mode === 'create' ? 'Agregar' : 'Guardar';

  return (
    <GenericModal
      title={modalTitle}
      fields={fields}
      initialData={initialData}
      onSubmit={onSubmit}
      onClose={onClose}
      isSubmitting={isSubmitting}
      submitButtonText={submitButtonText}
    />
  );
}
