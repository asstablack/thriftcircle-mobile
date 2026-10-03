import { create } from 'zustand';

type Role = 'organizer' | 'member' | null;

type User = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

type SelectedGroup = {
  id: string;
  groupName: string;
  role: 'organizer' | 'member';
};

type AuthStore = {
  selectedRole: Role;
  user: User | null;
  selectedGroup: SelectedGroup | null;
  isAuthenticated: boolean;

  setRole: (role: 'organizer' | 'member') => void;
  setUser: (user: User) => void;
  setSelectedGroup: (group: SelectedGroup) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  selectedRole: null,
  user: null,
  selectedGroup: null,
  isAuthenticated: false,

  setRole: (role) => set({ selectedRole: role }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setSelectedGroup: (group) =>
    set({
      selectedGroup: group,
    }),

  clearAuth: () =>
    set({
      selectedRole: null,
      user: null,
      selectedGroup: null,
      isAuthenticated: false,
    }),
}));