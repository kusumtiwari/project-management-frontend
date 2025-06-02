import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface SessionStoreState {
    token: string;
    setToken: (token: string) => void;
    clearToken: () => void;
}

export const useSessionStore = create<SessionStoreState>()(
    persist(
        (set) => ({
            token: '',
            setToken: (token: string) => set({ token }),
            clearToken: () => set({ token: '' }),
        }),
        {
            name: 'session-storage',
        }
    )
)