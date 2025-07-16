import { AuthContext, type AuthContextType } from "@/providers/AuthContext";
import { useContext } from "react";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if(!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}