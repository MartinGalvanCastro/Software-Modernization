/**
 * Utility functions for handling API errors and extracting user-friendly error messages
 */

interface ApiError {
  message?: string;
  detail?: string;
  status?: number;
  statusText?: string;
}

/**
 * Extracts a user-friendly error message from various error formats
 */
export function extractErrorMessage(error: unknown): string {
  // Default error message
  const defaultMessage = 'Ocurrió un error inesperado. Por favor intenta de nuevo.';

  if (!error) {
    return defaultMessage;
  }

  // If error is a string
  if (typeof error === 'string') {
    return error;
  }

  // If error is an object with message property
  if (typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    
    // Check for detailed error message
    if (apiError.detail) {
      return apiError.detail;
    }
    
    // Check for standard message
    if (apiError.message) {
      return apiError.message;
    }
  }

  // Handle HTTP status errors
  if (typeof error === 'object' && 'status' in error) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
      case 400:
        return 'Los datos enviados son inválidos. Revisa la información e intenta de nuevo.';
      case 401:
        return 'No tienes permisos para realizar esta acción.';
      case 403:
        return 'Acceso prohibido para realizar esta operación.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 409:
        return 'Ya existe un registro con esa información.';
      case 422:
        return 'Los datos enviados no son válidos. Verifica la información.';
      case 500:
        return 'Error interno del servidor. Por favor intenta más tarde.';
      case 503:
        return 'El servicio no está disponible temporalmente.';
      default:
        return `Error del servidor (${apiError.status}). ${apiError.statusText || 'Intenta de nuevo más tarde.'}`;
    }
  }

  // Handle network errors
  if (error instanceof Error) {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.';
    }
    
    return error.message || defaultMessage;
  }

  return defaultMessage;
}

/**
 * Creates a formatted error object for consistent error handling
 */
export function createErrorObject(error: unknown): { message: string; originalError: unknown } {
  return {
    message: extractErrorMessage(error),
    originalError: error
  };
}
