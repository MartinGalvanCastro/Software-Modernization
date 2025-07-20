import { GenericModal, type FormField } from '@/components/GenericModal';
import { ENTITY_FIELDS_CONFIG, ENTITY_LABELS, type EntityType } from './entityFieldsConfig';

interface AddModalProps {
  entityType: EntityType;
  isOpen: boolean;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  customFields?: FormField[]; // Optional custom fields to override entity config
}

export function AddModal({
  entityType,
  isOpen,
  onSubmit,
  onClose,
  isSubmitting,
  customFields
}: AddModalProps) {
  if (!isOpen) return null;

  const fields = customFields || ENTITY_FIELDS_CONFIG[entityType];
  const entityLabel = ENTITY_LABELS[entityType];
  
  // Get initial empty data based on fields
  const getInitialData = (): Record<string, unknown> => {
    const initialData: Record<string, unknown> = {};
    fields.forEach(field => {
      switch (field.type) {
        case 'number':
          initialData[field.name] = 0;
          break;
        case 'date':
          // Set today's date as default for date fields
          initialData[field.name] = new Date().toISOString().split('T')[0];
          break;
        case 'textarea':
        case 'text':
        case 'email':
        case 'select':
        default:
          initialData[field.name] = '';
          break;
      }
    });
    return initialData;
  };

  return (
    <GenericModal
      title={`Agregar ${entityLabel.singular}`}
      fields={fields}
      initialData={getInitialData()}
      onSubmit={onSubmit}
      onClose={onClose}
      isSubmitting={isSubmitting}
      submitButtonText="Agregar"
      successMessage={`${entityLabel.singular.charAt(0).toUpperCase() + entityLabel.singular.slice(1)} agregado exitosamente.`}
    />
  );
}
