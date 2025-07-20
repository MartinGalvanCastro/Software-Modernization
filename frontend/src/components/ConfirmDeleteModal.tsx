import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { extractErrorMessage } from '@/lib/errorUtils';

interface ConfirmDeleteModalProps {
  title: string;
  message: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  successMessage?: string;
}

export function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onClose,
  isSubmitting,
  confirmButtonText = 'Eliminar',
  cancelButtonText = 'Cancelar',
  successMessage
}: ConfirmDeleteModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      
      // Show success toast and close modal
      toast.success(successMessage || 'Elemento eliminado exitosamente.');
      onClose();
      
    } catch (error) {
      console.error('Delete confirmation error:', error);
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Eliminando...' : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
