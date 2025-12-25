export const auth: AuthContext = {
  isAuthenticated: false,
  email: null,
  login: async (email: string) => {
    auth.isAuthenticated = true;
    auth.email = email;
    return true;
  },
  logout: async () => {
    auth.isAuthenticated = false;
    auth.email = null;
  },
};

export interface AuthContext {
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  email: string | null;
}
