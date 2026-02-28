import { create } from "zustand";

export type UserInfo = {
  _id: string;
  username?: string;
  email?: string;
  userProfileImage?: string;
  role?: string;
};

type AuthState = {
  // Client-side convenience state (NOT security).
  // Real auth is enforced via httpOnly cookies + middleware.ts
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
