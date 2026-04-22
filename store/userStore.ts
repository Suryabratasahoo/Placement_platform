// store/userStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface UserState {
    userId: string | null;
    name: string | null;
    email: string | null;
    role: 'student' | 'senior' | 'admin' | null;
    universityId: string | null;
    isAuthenticated: boolean;
    
    // Actions
    setAuth: (userData: {
        userId: string;
        name: string;
        email: string;
        role: 'student' | 'senior' | 'admin';
        universityId: string | null;
    }) => void;
    
    clearAuth: () => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userId: null,
            name: null,
            email: null,
            role: null,
            universityId: null,
            isAuthenticated: false,

            setAuth: (userData: any) => set({
                userId: userData.userId,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                universityId: userData.universityId,
                isAuthenticated: true
            }),

            clearAuth: () => set({
                userId: null,
                name: null,
                email: null,
                role: null,
                universityId: null,
                isAuthenticated: false
            }),

            logout: () => {
                set({
                    userId: null,
                    name: null,
                    email: null,
                    role: null,
                    universityId: null,
                    isAuthenticated: false
                });
                // Clear the cookie for middleware
                Cookies.remove('token');
            }
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
