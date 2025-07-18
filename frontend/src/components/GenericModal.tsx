import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface GenericModalProps {
  title: string;
  fields: FormField[];
  initialData: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function GenericModal({
  title,
  fields,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  submitButtonText = 'Guardar'
}: GenericModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateField = (field: FormField, value: unknown): string => {
    const stringValue = value?.toString() || '';
    
    if (field.required && (!value || stringValue.trim() === '')) {
      return `${field.label} es requerido`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(stringValue)) {
        return 'Ingresa un email válido';
      }
    }

    if (field.type === 'number' && value) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'Debe ser un número válido';
      }
      if (field.validation?.min !== undefined && numValue < field.validation.min) {
        return `Debe ser mayor o igual a ${field.validation.min}`;
      }
      if (field.validation?.max !== undefined && numValue > field.validation.max) {
        return `Debe ser menor o igual a ${field.validation.max}`;
      }
    }

    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(stringValue)) {
        return 'Formato inválido';
      }
    }

    return '';
  };

  const handleInputChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle submission error
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const stringValue = value?.toString() || '';

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            value={stringValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select
            value={stringValue}
            onValueChange={(newValue) => handleInputChange(field.name, newValue)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Selecciona ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            value={stringValue}
            onChange={(e) => {
              const newValue = field.type === 'number' ? Number(e.target.value) || 0 : e.target.value;
              handleInputChange(field.name, newValue);
            }}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="text-sm text-red-600">{errors[field.name]}</p>
              )}
            </div>
          ))}
          
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
