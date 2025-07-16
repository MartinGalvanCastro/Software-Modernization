import { type JSX } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function LoadingScreen(): JSX.Element {
  // Set dynamic page title
  useDocumentTitle('Cargando...');

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50"
      role="status"
    >
      <svg
        className="animate-spin h-12 w-12 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="ml-4 text-lg font-medium text-gray-600">
        Loading
      </span>
    </div>
  );
}
