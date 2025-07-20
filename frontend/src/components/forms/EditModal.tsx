import { GenericModal, type FormField } from '@/components/GenericModal';
import { ENTITY_FIELDS_CONFIG, ENTITY_LABELS, type EntityType } from './entityFieldsConfig';

interface EditModalProps<T> {
  entityType: EntityType;
  isOpen: boolean;
  entityData: T;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  customFields?: FormField[]; // Optional custom fields to override entity config
}

export function EditModal<T = Record<string, unknown>>({
  entityType,
  isOpen,
  entityData,
  onSubmit,
  onClose,
  isSubmitting,
  customFields
}: EditModalProps<T>) {
  if (!isOpen) return null;

  const fields = customFields || ENTITY_FIELDS_CONFIG[entityType];
  const entityLabel = ENTITY_LABELS[entityType];
  
  // Get initial data from entity, converting types as needed
  const getInitialData = (): Record<string, unknown> => {
    const initialData: Record<string, unknown> = {};
    const data = entityData as Record<string, unknown>;
    
    fields.forEach(field => {
      let value = data[field.name];
      
      // Handle undefined/null values
      if (value === undefined || value === null) {
        switch (field.type) {
          case 'number':
            value = 0;
            break;
          case 'date':
            value = new Date().toISOString().split('T')[0];
            break;
          default:
            value = '';
            break;
        }
      } else {
        // Type conversion based on field type
        switch (field.type) {
          case 'number':
            value = Number(value) || 0;
            break;
          case 'date': {
            // Ensure date is in YYYY-MM-DD format
            const dateValue = new Date(value.toString());
            value = isNaN(dateValue.getTime()) 
              ? new Date().toISOString().split('T')[0] 
              : dateValue.toISOString().split('T')[0];
            break;
          }
          case 'textarea':
          case 'text':
          case 'email':
          case 'select':
          default:
            value = value.toString();
            break;
        }
      }
      
      initialData[field.name] = value;
    });
    
    return initialData;
  };

  return (
    <GenericModal
      title={`Editar ${entityLabel.singular}`}
      fields={fields}
      initialData={getInitialData()}
      onSubmit={onSubmit}
      onClose={onClose}
      isSubmitting={isSubmitting}
      submitButtonText="Guardar"
      successMessage={`${entityLabel.singular.charAt(0).toUpperCase() + entityLabel.singular.slice(1)} actualizado exitosamente.`}
    />
  );
}
