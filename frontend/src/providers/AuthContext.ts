import { createContext } from "react";
import type { AuthSession, AuthTokens, SignInInput } from "aws-amplify/auth";
import type { FormatedAuthError } from "@/lib/authErrorUtils";

export interface AuthContextType {
  isAuthenticated: boolean;
  session?: AuthSession;
  tokens?: AuthTokens;
  username?: string;
  isLoading: boolean;
  error?: FormatedAuthError;
  login: (input: SignInInput) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});
