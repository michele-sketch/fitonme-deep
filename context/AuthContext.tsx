import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, PlanId, UserProfileData } from '../types';
import { 
    getCurrentUser,
    signIn as signInService,
    signUp as signUpService,
    signOut as signOutService, 
    purchaseCredits as purchaseCreditsService,
    updateUserProfile as updateUserProfileService,
    getRenderHistory,
    addRenderToHistory as addRenderToHistoryService,
    removeRenderFromHistory as removeRenderFromHistoryService
} from '../services/authService';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    purchaseCredits: (planId: PlanId) => Promise<void>;
    updateUserProfile: (profileData: UserProfileData) => Promise<void>;
    refreshUser: () => Promise<void>;
    renderHistory: string[];
    addRenderToHistory: (newImage: string) => void;
    removeRenderFromHistory: (imageToRemove: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [renderHistory, setRenderHistory] = useState<string[]>([]);

    const refreshUser = useCallback(async () => {
        try {
            const refreshedUser = await getCurrentUser();
            setUser(refreshedUser);
        } catch (error) {
            console.error("Error refreshing user data", error);
            setUser(null); // Clear user if token is invalid
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            await refreshUser();
            setRenderHistory(getRenderHistory());
            setLoading(false);
        };
        initializeAuth();
    }, [refreshUser]);

    const signIn = async (email: string, password: string) => {
        const loggedInUser = await signInService(email, password);
        setUser(loggedInUser);
    };
    
    const signUp = async (email: string, password: string) => {
        const newUser = await signUpService(email, password);
        setUser(newUser);
    };

    const signOut = async () => {
        await signOutService();
        setUser(null);
    };

    const purchaseCredits = async (planId: PlanId) => {
        if (!user || !planId) return;
        const updatedUser = await purchaseCreditsService(planId);
        setUser(updatedUser);
    };

    const updateUserProfile = async (profileData: UserProfileData) => {
        if (!user) return;
        const updatedUser = await updateUserProfileService(profileData);
        setUser(updatedUser);
    };

    const addRenderToHistory = (newImage: string) => {
        const newHistory = addRenderToHistoryService(newImage);
        setRenderHistory(newHistory);
    };
    
    const removeRenderFromHistory = (imageToRemove: string) => {
        const newHistory = removeRenderFromHistoryService(imageToRemove);
        setRenderHistory(newHistory);
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        purchaseCredits,
        updateUserProfile,
        refreshUser,
        renderHistory,
        addRenderToHistory,
        removeRenderFromHistory,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
