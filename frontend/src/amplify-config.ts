import { Amplify, type ResourcesConfig } from 'aws-amplify';
import type { AuthConfig, APIConfig, LibraryOptions } from '@aws-amplify/core';

// Cognito User Pool config for username/password
const authConfig: AuthConfig = {
  Cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
    loginWith: { username: true }
  }
};

// Typed REST API config
const apiConfig: APIConfig = {
  REST: {
    GestorAPI: {
      endpoint: import.meta.env.VITE_API_BASE_URL,
      region: import.meta.env.VITE_AWS_REGION,
      service: 'execute-api'
    }
  }
};

// Library options for dynamic header forwarding
const libraryOptions: LibraryOptions = {
  API: {
    REST: {
      headers: async () => {
        const { fetchAuthSession } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        return { Authorization: `Bearer ${session.tokens?.idToken?.toString()}` };
      }
    }
  }
};

// Apply configuration
const amplifyConfig: ResourcesConfig = { Auth: authConfig, API: apiConfig };
Amplify.configure(amplifyConfig, libraryOptions);