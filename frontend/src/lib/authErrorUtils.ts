import { type AuthError } from 'aws-amplify/auth';

/**
 * Custom error class for formatted auth error messages
 */
export class FormatedAuthError extends Error {
  public readonly originalError: AuthError;

  constructor(originalError: AuthError, userMessage: string) {
    super(userMessage);
    this.name = 'FormatedAuthError';
    this.originalError = originalError;
  }
}

/**
 * Maps AuthError names to user-friendly messages
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'UserNotFoundException': 'Usuario no registrado',
  'NotAuthorizedException': 'Credenciales incorrectas',
};

/**
 * Converts an AuthError to a FormatedAuthError with appropriate user message
 */
export function createFormatedAuthError(error: unknown): FormatedAuthError {
  // Check if it's an AuthError (has name property and constructor name is _AuthError)
  const isAuthError = error && 
    typeof error === 'object' && 
    'name' in error && 
    error.constructor?.name === '_AuthError';

  if (isAuthError) {
    const authError = error as AuthError;
    const errorName = authError.name;
    const userMessage = AUTH_ERROR_MESSAGES[errorName] || 'Error desconocido, intenta más tarde';
    
    return new FormatedAuthError(authError, userMessage);
  }

  // If it's not an AuthError, create a generic error
  const fallbackError = {
    name: 'UnknownError',
    message: error instanceof Error ? error.message : 'Error desconocido'
  } as AuthError;

  return new FormatedAuthError(
    fallbackError, 
    'Error desconocido, intenta más tarde'
  );
}

/**
 * Type guard to check if an error is a FormatedAuthError
 */
export function isFormatedAuthError(error: unknown): error is FormatedAuthError {
  return error instanceof FormatedAuthError;
}
