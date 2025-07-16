import { useState, useEffect, useCallback, useMemo } from 'react';
import { type AuthSession, type AuthTokens, fetchAuthSession, getCurrentUser, signIn, signOut, type SignInInput } from 'aws-amplify/auth';
import { createFormatedAuthError, type FormatedAuthError } from '@/lib/authErrorUtils';
import { LoadingScreen } from "@/pages/LoadingScreen";
import React, { type JSX } from "react";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: React.PropsWithChildren): JSX.Element {
    const [session, setSession] = useState<AuthSession | undefined>(undefined);
    const [tokens, setTokens] = useState<AuthTokens | undefined>(undefined);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<FormatedAuthError | undefined>(undefined);

    const loadUserInfo = useCallback(async (hasTokens: boolean) => {
        if (hasTokens) {
            try {
                const user = await getCurrentUser();
                setUsername(user.username);
            } catch {
                // User info fetch failed, but session is still valid
                setUsername(undefined);
            }
        } else {
            // Clear user data when not authenticated
            setUsername(undefined);
        }
    }, []);

    const loadSession = useCallback(async (forceRefresh: boolean = false) => {
        try {
            const s = await fetchAuthSession({forceRefresh});
            setSession(s);
            setTokens(s.tokens ?? undefined);
            
            // Load user info based on token presence
            await loadUserInfo(!!s.tokens?.accessToken);
            
            setError(undefined); // Clear any previous errors on success
        } catch (e) {
            // Clear all auth data on error
            const formatedError = createFormatedAuthError(e);
            setError(formatedError);
            setSession(undefined);
            setTokens(undefined);
            setUsername(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [loadUserInfo]);

    const login = useCallback(async (input: SignInInput) => {
        setIsLoading(true);
        setError(undefined);
        try {
            await signIn(input);
            await loadSession(true); // Refresh session after login
        } catch (e) {
            const formatedError = createFormatedAuthError(e);
            setError(formatedError);
            setIsLoading(false); // Set loading to false on error
            throw formatedError; // Re-throw for components to handle
        }
        // Note: isLoading is set to false in loadSession finally block
    }, [loadSession]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        setError(undefined);
        try {
            await signOut();
            await loadSession(true); // Refresh session after logout
        } catch (e) {
            const formatedError = createFormatedAuthError(e);
            setError(formatedError);
            setIsLoading(false); // Set loading to false on error
            throw formatedError; // Re-throw for components to handle
        }
        // Note: isLoading is set to false in loadSession finally block
    }, [loadSession]);

    // Load session on mount
    useEffect(() => {
        let mounted = true;
        if (mounted) loadSession();
        return () => { mounted = false; };
    }, [loadSession]);

    // Token refresh logic
    useEffect(() => {
        if (!tokens?.accessToken?.payload.exp) return;
        const expiresAt = tokens.accessToken.payload.exp * 1000;
        const now = Date.now();
        const threshold = 60 * 1000; // 1 minute
        const timeout = expiresAt - now - threshold;
        if (timeout <= 0) {
            loadSession(true);
            return;
        }
        const timer = setTimeout(() => loadSession(true), timeout);
        return () => clearTimeout(timer);
    }, [tokens, loadSession]);

    const contextValue = useMemo(() => ({
        session,
        tokens,
        username,
        isLoading,
        error,
        isAuthenticated: !!tokens?.accessToken,
        login,
        logout,
        loginLoading: isLoading, // Use the same loading state for all actions
        logoutLoading: isLoading // Use the same loading state for all actions
    }), [session, tokens, username, isLoading, error, login, logout]);

    if(isLoading){
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}