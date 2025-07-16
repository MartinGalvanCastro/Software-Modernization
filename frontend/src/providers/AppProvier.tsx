import React, {type PropsWithChildren} from "react";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { AuthProvider } from "./AuthProvider";

export const AppProvider: React.FC<PropsWithChildren> = ({children}) => {

  return (
    <ReactQueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ReactQueryProvider>
  );
}